"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../services/auth/auth-context";

export const GoogleSignInTest: React.FC = () => {
  const {
    initializeGoogleAuth,
    promptGoogleSignIn,
    googleLoading,
    isAuthenticated,
  } = useAuthContext();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeGoogleAuth();
        setInitialized(true);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize Google Auth"
        );
      }
    };

    initAuth();
  }, [initializeGoogleAuth]);

  const handleSignIn = async () => {
    try {
      setError(null);
      await promptGoogleSignIn();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to prompt Google Sign-In"
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Google Sign-In Test</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            Status: {initialized ? "✅ Initialized" : "⏳ Initializing..."}
          </p>
          <p className="text-sm text-gray-600">
            Authentication:{" "}
            {isAuthenticated ? "✅ Authenticated" : "❌ Not authenticated"}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={!initialized || googleLoading}
          className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </button>

        <div className="text-xs text-gray-500">
          <p>This test component verifies:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Google OAuth initialization (button-only mode)</li>
            <li>FedCM warning avoidance</li>
            <li>Button-based authentication</li>
            <li>Token verification</li>
          </ul>
          <p className="mt-2 text-green-600">
            ✅ Using button-only approach to avoid FedCM warnings
          </p>
        </div>
      </div>
    </div>
  );
};
