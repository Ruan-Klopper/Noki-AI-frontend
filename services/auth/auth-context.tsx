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

// Auth Context Type
interface AuthContextType {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  profile: AuthProfile | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthTokens>>;
  register: (userData: RegisterData) => Promise<ApiResponse<AuthTokens>>;
  googleAuth: (idToken: string) => Promise<ApiResponse<AuthTokens>>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;

  // Google OAuth
  initializeGoogleAuth: () => Promise<void>;
  renderGoogleButton: (elementId: string, options?: any) => void;
  promptGoogleSignIn: () => void;
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

  // Initialize Google OAuth
  const initializeGoogleAuth = async (): Promise<void> => {
    if (googleInitialized) return;

    try {
      await GoogleAuth.initialize();
      GoogleAuth.setCallback((credential: string) => {
        authHook.googleAuth(credential);
      });
      setGoogleInitialized(true);
    } catch (error) {
      console.error("Failed to initialize Google OAuth:", error);
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

  // Prompt Google sign-in
  const promptGoogleSignIn = (): void => {
    if (!googleInitialized) {
      console.warn("Google OAuth not initialized");
      return;
    }
    GoogleAuth.prompt();
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

    // Actions
    login: authHook.login,
    register: authHook.register,
    googleAuth: authHook.googleAuth,
    logout: authHook.logout,
    fetchProfile: authHook.fetchProfile,

    // Google OAuth
    initializeGoogleAuth,
    renderGoogleButton,
    promptGoogleSignIn,
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
