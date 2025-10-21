// Cookie management utilities for HTTP-only cookies
export class CookieManager {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly USER_DATA_KEY = "user_data";

  // Set HTTP-only cookie (server-side only)
  static setHttpOnlyCookie(
    name: string,
    value: string,
    options: {
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
    } = {}
  ): void {
    if (typeof window !== "undefined") {
      console.warn("setHttpOnlyCookie should only be called server-side");
      return;
    }

    // This would typically be used in API routes or middleware
    // For now, we'll use regular cookies as fallback
    this.setCookie(name, value, options);
  }

  // Set regular cookie (client-side fallback)
  static setCookie(
    name: string,
    value: string,
    options: {
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
    } = {}
  ): void {
    if (typeof window === "undefined") return;

    const {
      maxAge = 7 * 24 * 60 * 60, // 7 days default
      path = "/",
      domain,
      secure = process.env.NODE_ENV === "production",
      sameSite = "lax",
    } = options;

    let cookieString = `${name}=${encodeURIComponent(
      value
    )}; max-age=${maxAge}; path=${path}; samesite=${sameSite}`;

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += "; secure";
    }

    document.cookie = cookieString;
  }

  // Get cookie value
  static getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  // Delete cookie
  static deleteCookie(name: string, path: string = "/"): void {
    if (typeof window === "undefined") return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  }

  // Token management methods
  static setAccessToken(token: string): void {
    this.setCookie(this.ACCESS_TOKEN_KEY, token, {
      maxAge: 24 * 60 * 60, // 24 hours
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  static getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY);
  }

  static clearAccessToken(): void {
    this.deleteCookie(this.ACCESS_TOKEN_KEY);
  }

  static setUserData(userData: any): void {
    this.setCookie(this.USER_DATA_KEY, JSON.stringify(userData), {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  static getUserData(): any | null {
    const userData = this.getCookie(this.USER_DATA_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  static clearUserData(): void {
    this.deleteCookie(this.USER_DATA_KEY);
  }

  static clearAllAuthData(): void {
    this.clearAccessToken();
    this.clearUserData();
  }

  // Check if token is expired (basic JWT check)
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token ? !this.isTokenExpired(token) : false;
  }
}
