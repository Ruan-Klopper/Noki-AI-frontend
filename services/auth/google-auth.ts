// Google OAuth 2.0 utility for handling Google authentication
export class GoogleAuth {
  private static readonly GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  private static readonly GOOGLE_SCOPES = ["openid", "email", "profile"];

  // Initialize Google OAuth
  static async initialize(): Promise<void> {
    if (typeof window === "undefined" || !this.GOOGLE_CLIENT_ID) {
      console.warn("Google OAuth not configured");
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: this.GOOGLE_CLIENT_ID!,
            callback: this.handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
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

  // Handle Google credential response
  private static handleCredentialResponse = (response: any): void => {
    // This will be handled by the component using the hook
    if (window.googleAuthCallback) {
      window.googleAuthCallback(response.credential);
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

  // Prompt Google sign-in
  static prompt(): void {
    if (typeof window === "undefined" || !window.google) {
      console.warn("Google OAuth not initialized");
      return;
    }

    window.google.accounts.id.prompt();
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
}

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
    googleAuthCallback?: (credential: string) => void;
  }
}
