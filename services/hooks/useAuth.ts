import { useState, useEffect, useCallback } from "react";
import {
  AuthService,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthProfile,
  ApiResponse,
  UserProfile,
} from "../types";
import { getAuthService, CookieManager } from "../index";

// Auth hook for managing authentication state
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const authService = getAuthService();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      const userData = authService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setUser(userData);
      setIsLoading(false);

      // If authenticated, fetch profile data
      if (authenticated && userData) {
        fetchProfile();
      }
    };

    checkAuthStatus();
  }, [authService]);

  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [authService]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
      setIsLoading(true);
      try {
        const response = await authService.login(credentials);
        if (response.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          await fetchProfile();
        }
        return response;
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [authService, fetchProfile]
  );

  const register = useCallback(
    async (userData: RegisterData): Promise<ApiResponse<AuthTokens>> => {
      setIsLoading(true);
      try {
        const response = await authService.register(userData);
        if (response.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          await fetchProfile();
        }
        return response;
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [authService, fetchProfile]
  );

  const googleAuth = useCallback(
    async (idToken: string): Promise<ApiResponse<AuthTokens>> => {
      setIsLoading(true);
      try {
        const response = await authService.googleAuth(idToken);
        if (response.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          await fetchProfile();
        }
        return response;
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [authService, fetchProfile]
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  }, [authService]);

  return {
    isAuthenticated,
    isLoading,
    user,
    profile,
    login,
    register,
    googleAuth,
    logout,
    fetchProfile,
    setUser,
  };
};
