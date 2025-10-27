import {
  AuthService,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthProfile,
  ApiResponse,
} from "../types";
import { HttpClient } from "../http";
import { CookieManager } from "../config/cookie-manager";
import { getIndexedDBService } from "../storage/indexeddb.service";

// Auth Service implementation following Single Responsibility Principle
export class AuthServiceImpl implements AuthService {
  readonly baseUrl = "/auth";
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> {
    try {
      const response = await this.httpClient.post<AuthTokens>(
        `${this.baseUrl}/login`,
        credentials
      );

      if (response.success && response.data) {
        // Store access token and user data in cookies
        CookieManager.setAccessToken(response.data.access_token);
        CookieManager.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthTokens>> {
    try {
      const response = await this.httpClient.post<AuthTokens>(
        `${this.baseUrl}/register`,
        userData
      );

      if (response.success && response.data) {
        // Store access token and user data in cookies
        CookieManager.setAccessToken(response.data.access_token);
        CookieManager.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    console.log("[Auth] Logging out - clearing local data...");

    try {
      // Clear all auth data (cookies and tokens)
      CookieManager.clearAllAuthData();
      console.log("[Auth] ✓ Cookies and tokens cleared");

      // Clear IndexedDB data
      try {
        const indexedDBService = getIndexedDBService();
        await indexedDBService.clearAll();
        console.log("[Auth] ✓ IndexedDB cleared");
      } catch (dbError) {
        console.error("[Auth] ✗ Failed to clear IndexedDB:", dbError);
      }

      // Return success response without calling backend
      return {
        success: true,
        status: 200,
        message: "Logout successful",
        data: undefined,
      };
    } catch (error) {
      console.error("[Auth] Error during logout:", error);

      // Still try to clear data even if something fails
      CookieManager.clearAllAuthData();

      try {
        const indexedDBService = getIndexedDBService();
        await indexedDBService.clearAll();
      } catch (dbError) {
        console.error("[Auth] Failed to clear IndexedDB:", dbError);
      }

      // Return success anyway since we cleared local data
      return {
        success: true,
        status: 200,
        message: "Logout successful (with errors)",
        data: undefined,
      };
    }
  }

  async getProfile(): Promise<ApiResponse<AuthProfile>> {
    return this.httpClient.get<AuthProfile>(`${this.baseUrl}/profile`);
  }

  async googleAuth(idToken: string): Promise<ApiResponse<AuthTokens>> {
    try {
      const response = await this.httpClient.post<AuthTokens>(
        `${this.baseUrl}/google/token`,
        { idToken }
      );

      if (response.success && response.data) {
        // Store access token and user data in cookies
        CookieManager.setAccessToken(response.data.access_token);
        CookieManager.setUserData(response.data.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return CookieManager.isAuthenticated();
  }

  getCurrentToken(): string | null {
    return CookieManager.getAccessToken();
  }

  getCurrentUser(): any | null {
    return CookieManager.getUserData();
  }
}
