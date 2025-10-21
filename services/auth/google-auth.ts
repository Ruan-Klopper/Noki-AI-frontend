// Google OAuth 2.0 utility for handling Google authentication (Browser-only)
export class GoogleAuth {
  private static GOOGLE_CLIENT_ID: string | undefined;
  private static readonly GOOGLE_SCOPES = ["openid", "email", "profile"];

  // Set the Google Client ID (should be called from server-side)
  static setClientId(clientId: string): void {
    this.GOOGLE_CLIENT_ID = clientId;
  }

  // Generate a nonce for security
  private static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  // Initialize Google OAuth
  static async initialize(): Promise<void> {
    if (typeof window === "undefined") {
      console.warn("Google OAuth initialization called on server side");
      return;
    }

    if (!this.GOOGLE_CLIENT_ID) {
      const error =
        "Google OAuth not configured - NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable is missing";
      console.error(error);
      throw new Error(error);
    }

    // Prevent multiple initializations
    if (window.google?.accounts?.id) {
      console.log("Google OAuth already initialized");
      return;
    }

    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (
        document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]'
        )
      ) {
        if (window.google) {
          this.setupGoogleAccounts();
          resolve();
        } else {
          // Script exists but Google object not ready, wait for it
          const checkGoogle = setInterval(() => {
            if (window.google) {
              clearInterval(checkGoogle);
              this.setupGoogleAccounts();
              resolve();
            }
          }, 100);

          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkGoogle);
            reject(new Error("Google OAuth script timeout"));
          }, 10000);
        }
        return;
      }

      const script = document.createElement("script");
      // Add aggressive cache-busting to force fresh script load
      const version = Date.now() + Math.random();
      script.src = `https://accounts.google.com/gsi/client?v=${version}&cb=${version}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google) {
          this.setupGoogleAccounts();
          resolve();
        } else {
          reject(new Error("Google OAuth failed to load"));
        }
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google OAuth script"));
      };

      document.head.appendChild(script);
    });
  }

  // Setup Google Accounts after script loads
  private static setupGoogleAccounts(): void {
    if (!window.google || !this.GOOGLE_CLIENT_ID) return;

    try {
      // Button-only configuration to avoid FedCM warnings
      const config = {
        client_id: this.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        // Avoid FedCM configuration that triggers warnings
      };

      window.google.accounts.id.initialize(config);

      console.log(
        "Google OAuth initialized successfully (button-only mode):",
        this.GOOGLE_CLIENT_ID.substring(0, 20) + "..."
      );
      console.log("Current domain:", window.location.origin);
      console.log("Using button-based authentication to avoid FedCM warnings");
      console.log("Configuration:", config);
    } catch (error) {
      console.error("Error initializing Google OAuth:", error);
      throw error;
    }
  }

  // Handle Google credential response
  private static handleCredentialResponse = (response: any): void => {
    // This will be handled by the component using the hook
    if (window.googleAuthCallback) {
      window.googleAuthCallback(response.credential);
    }
    // Stop loading state
    if (window.stopGoogleLoading) {
      window.stopGoogleLoading();
    }
  };

  // Render Google sign-in button
  static renderButton(
    elementId: string,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      logo_alignment?: "left" | "center";
      width?: number;
    } = {}
  ): void {
    if (typeof window === "undefined" || !window.google) {
      console.warn("Google OAuth not initialized");
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id ${elementId} not found`);
      return;
    }

    window.google.accounts.id.renderButton(element, {
      theme: options.theme || "outline",
      size: options.size || "large",
      text: options.text || "signin_with",
      shape: options.shape || "rectangular",
      logo_alignment: options.logo_alignment || "left",
      width: options.width || 250,
    });
  }

  // Trigger sign-in using existing button (avoids duplicate buttons)
  static triggerSignIn(): void {
    if (typeof window === "undefined") {
      console.warn("Google OAuth trigger called on server side");
      return;
    }

    if (!window.google?.accounts?.id) {
      console.warn(
        "Google OAuth not initialized - please call initialize() first"
      );
      return;
    }

    try {
      // Find the Google Sign-In button container and trigger the button inside it
      const googleButtonContainer = document.getElementById(
        "google-signin-button"
      );
      if (googleButtonContainer) {
        const googleButton = googleButtonContainer.querySelector(
          '[role="button"]'
        ) as HTMLElement;
        if (googleButton) {
          console.log("Triggering existing Google Sign-In button");
          googleButton.click();
          return;
        }
      }

      console.log("No Google button found, this should not happen");
    } catch (error) {
      console.error("Error triggering Google sign-in:", error);
    }
  }

  // Render a temporary sign-in button
  private static renderSignInButton(): void {
    // Remove any existing temporary buttons first
    const existingTemp = document.getElementById("temp-google-signin");
    if (existingTemp) {
      existingTemp.remove();
    }

    // Create a temporary button element
    const tempDiv = document.createElement("div");
    tempDiv.id = "temp-google-signin";
    tempDiv.style.position = "fixed";
    tempDiv.style.top = "50%";
    tempDiv.style.left = "50%";
    tempDiv.style.transform = "translate(-50%, -50%)";
    tempDiv.style.zIndex = "9999";
    tempDiv.style.backgroundColor = "white";
    tempDiv.style.padding = "20px";
    tempDiv.style.borderRadius = "8px";
    tempDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";

    document.body.appendChild(tempDiv);

    // Render Google button in the temporary div
    this.renderButton("temp-google-signin", {
      theme: "outline",
      size: "large",
      text: "signin_with",
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
    }, 10000);
  }

  // Cancel Google sign-in
  static cancel(): void {
    if (typeof window === "undefined" || !window.google) {
      return;
    }

    window.google.accounts.id.cancel();
  }

  // Disable auto-select
  static disableAutoSelect(): void {
    if (typeof window === "undefined" || !window.google) {
      return;
    }

    window.google.accounts.id.disableAutoSelect();
  }

  // Store callback function globally
  static setCallback(callback: (credential: string) => void): void {
    if (typeof window !== "undefined") {
      (window as any).googleAuthCallback = callback;
    }
  }

  // Remove callback function
  static removeCallback(): void {
    if (typeof window !== "undefined") {
      delete (window as any).googleAuthCallback;
    }
  }

  // Verify ID token (client-side only - server verification should be done on backend)
  static async verifyIdToken(idToken: string): Promise<any> {
    if (typeof window === "undefined") {
      throw new Error("Token verification should be done on the server side");
    }

    try {
      // For client-side, we can decode the JWT token to get basic info
      // But proper verification should be done on the server
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Error decoding ID token:", error);
      throw error;
    }
  }

  // Check if Google OAuth is configured
  static isConfigured(): boolean {
    return !!this.GOOGLE_CLIENT_ID;
  }

  // Check if Google OAuth is initialized and ready
  static isInitialized(): boolean {
    return typeof window !== "undefined" && !!window.google?.accounts?.id;
  }

  // Check if FedCM is supported
  static isFedCMSupported(): boolean {
    return typeof window !== "undefined" && "IdentityCredential" in window;
  }

  // Get Google Client ID
  static getClientId(): string | undefined {
    return this.GOOGLE_CLIENT_ID;
  }

  // Clear Google OAuth state and reinitialize (useful for clearing cached config)
  static async clearAndReinitialize(): Promise<void> {
    if (typeof window === "undefined") return;

    console.log("Clearing all Google OAuth state and cache...");

    // Clear any existing Google OAuth state
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.cancel();
        window.google.accounts.id.disableAutoSelect();
      } catch (error) {
        console.log("Error clearing Google OAuth state:", error);
      }
    }

    // Remove ALL existing Google scripts to force reload
    const existingScripts = document.querySelectorAll(
      'script[src*="accounts.google.com/gsi/client"]'
    );
    existingScripts.forEach((script) => script.remove());

    // Clear Google object and any related globals
    delete (window as any).google;
    delete (window as any).googleAuthCallback;
    delete (window as any).stopGoogleLoading;

    // Clear any localStorage/sessionStorage related to Google
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("google") || key.includes("gsi")) {
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes("google") || key.includes("gsi")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.log("Error clearing storage:", error);
    }

    // Wait a bit then reinitialize
    await new Promise((resolve) => setTimeout(resolve, 200));
    await this.initialize();
  }
}

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
    googleAuthCallback?: (credential: string) => void;
    stopGoogleLoading?: () => void;
    IdentityCredential?: any;
  }
}
