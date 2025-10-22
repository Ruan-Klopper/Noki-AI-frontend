"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthProfile,
  ApiResponse,
  UserProfile,
} from "../types";
import { useAuth } from "../hooks/useAuth";
import { GoogleAuth } from "./google-auth";
import { notificationService } from "../notification/notification.service";

// Auth Context Type
interface AuthContextType {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  profile: AuthProfile | null;
  googleLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthTokens>>;
  register: (userData: RegisterData) => Promise<ApiResponse<AuthTokens>>;
  googleAuth: (idToken: string) => Promise<ApiResponse<AuthTokens>>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;

  // Google OAuth
  initializeGoogleAuth: () => Promise<void>;
  renderGoogleButton: (elementId: string, options?: any) => void;
  stopGoogleLoading: () => void;

  // Notifications
  showNotification: (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description?: string
  ) => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authHook = useAuth();
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Initialize Google OAuth (silent initialization, no loading states)
  const initializeGoogleAuth = async (): Promise<void> => {
    if (googleInitialized) return;

    try {
      // First, get the Google Client ID from the server
      const response = await fetch("/api/auth/google/client-id");
      if (!response.ok) {
        throw new Error("Failed to get Google Client ID from server");
      }
      const { clientId } = await response.json();

      // Set the client ID in GoogleAuth
      GoogleAuth.setClientId(clientId);

      // Initialize Google OAuth silently (no loading states)
      console.log("Initializing Google OAuth silently...");
      await GoogleAuth.initialize();

      GoogleAuth.setCallback(async (credential: string) => {
        try {
          // Show loading notification for Google auth
          showNotification(
            "info",
            "Signing in with Google...",
            "Please wait while we authenticate your account"
          );

          // Verify the token with our server
          const response = await fetch("/api/auth/google/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: credential }),
          });

          if (response.ok) {
            const { user } = await response.json();
            console.log("Google authentication successful:", user);
            // Call the auth hook with the verified user data
            const authResponse = await authHook.googleAuth(credential);

            // If authentication was successful, redirect based on context
            if (authResponse.success) {
              console.log(
                "Google authentication completed, determining redirect..."
              );

              // Show success notification
              if (window.location.pathname === "/signup") {
                showNotification(
                  "success",
                  "Google sign up successful!",
                  "Redirecting to LMS setup..."
                );
                console.log("Redirecting to signup step 3 (LMS Selection)...");
                // For signup, we need to stay on the same page but go to step 3
                // This will be handled by the signup page component
                window.location.href = "/signup?step=3";
              } else {
                showNotification(
                  "success",
                  "Welcome back!",
                  "You have been successfully signed in"
                );
                console.log("Redirecting to dashboard...");
                // For signin, redirect to dashboard
                window.location.href = "/dashboard";
              }
            } else {
              showNotification(
                "error",
                "Google authentication failed",
                authResponse.message || "Authentication failed"
              );
            }
          } else {
            console.error("Token verification failed");
            showNotification(
              "error",
              "Google authentication failed",
              "Token verification failed"
            );
            throw new Error("Token verification failed");
          }
        } catch (error) {
          console.error("Error in Google auth callback:", error);
          showNotification(
            "error",
            "Google authentication failed",
            error instanceof Error ? error.message : "Authentication failed"
          );
          // Still call the auth hook to handle the error
          await authHook.googleAuth(credential);
        }
      });

      // Set the stop loading function on window for Google Auth to use
      if (typeof window !== "undefined") {
        (window as any).stopGoogleLoading = stopGoogleLoading;
      }

      setGoogleInitialized(true);
      console.log("Google OAuth initialized successfully with FedCM support");
    } catch (error) {
      console.error("Failed to initialize Google OAuth:", error);
      throw error; // Re-throw to allow calling code to handle the error
    }
  };

  // Render Google sign-in button
  const renderGoogleButton = (elementId: string, options?: any): void => {
    if (!googleInitialized) {
      console.warn("Google OAuth not initialized");
      return;
    }
    GoogleAuth.renderButton(elementId, options);
  };

  // Stop Google loading state
  const stopGoogleLoading = (): void => {
    setGoogleLoading(false);
  };

  // Show notification
  const showNotification = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description?: string
  ): void => {
    notificationService.show({ type, title, description });
  };

  // Initialize Google OAuth on mount
  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      GoogleAuth.removeCallback();
    };
  }, []);

  const contextValue: AuthContextType = {
    // State
    isAuthenticated: authHook.isAuthenticated,
    isLoading: authHook.isLoading,
    user: authHook.user,
    profile: authHook.profile,
    googleLoading,

    // Actions
    login: authHook.login,
    register: authHook.register,
    googleAuth: authHook.googleAuth,
    logout: authHook.logout,
    fetchProfile: authHook.fetchProfile,

    // Google OAuth
    initializeGoogleAuth,
    renderGoogleButton,
    stopGoogleLoading,

    // Notifications
    showNotification,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login or show login component
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
