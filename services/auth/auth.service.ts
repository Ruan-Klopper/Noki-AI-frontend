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
    try {
      const response = await this.httpClient.post<void>(
        `${this.baseUrl}/logout`
      );

      // Clear all auth data regardless of API response
      CookieManager.clearAllAuthData();

      return response;
    } catch (error) {
      // Clear auth data even if logout fails
      CookieManager.clearAllAuthData();
      throw error;
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
