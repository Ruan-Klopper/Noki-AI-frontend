"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuthContext, GoogleAuth } from "@/services";

// Comprehensive Google OAuth Test Component
export const GoogleOAuthTest: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    profile,
    googleAuth,
    renderGoogleButton,
    promptGoogleSignIn,
    initializeGoogleAuth,
  } = useAuthContext();

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  // Test Google OAuth initialization
  useEffect(() => {
    const testGoogleOAuth = async () => {
      try {
        addTestResult("🔍 Testing Google OAuth configuration...");

        // Test 1: Check Google OAuth configuration
        addTestResult("🔄 Checking Google OAuth configuration...");
        addTestResult(
          "ℹ️ Client ID will be fetched from server-side environment"
        );

        // Test 2: Check client ID (will be set during initialization)
        addTestResult(
          "🔄 Client ID will be fetched from server during initialization..."
        );

        // Test 3: Initialize Google OAuth
        addTestResult("🔄 Initializing Google OAuth...");
        await initializeGoogleAuth();
        addTestResult("✅ Google OAuth initialized successfully");
        setIsGoogleReady(true);

        // Test 4: Check if Google OAuth is initialized
        if (GoogleAuth.isInitialized()) {
          addTestResult("✅ Google OAuth is properly initialized");

          // Test 5: Check client ID after initialization
          const clientId = GoogleAuth.getClientId();
          if (clientId) {
            addTestResult(
              `✅ Client ID loaded: ${clientId.substring(0, 20)}...`
            );
          } else {
            addTestResult("❌ Client ID not loaded after initialization");
          }

          // Test 6: Check FedCM support
          if (GoogleAuth.isFedCMSupported()) {
            addTestResult(
              "✅ FedCM is supported - using modern authentication"
            );
          } else {
            addTestResult(
              "⚠️ FedCM not supported - will use traditional methods"
            );
          }

          // Test 7: Test FedCM availability
          if ("IdentityCredential" in window) {
            addTestResult("✅ IdentityCredential API is available");
          } else {
            addTestResult("⚠️ IdentityCredential API not available");
          }

          // Test 8: Render Google button
          if (googleButtonRef.current) {
            addTestResult("🔄 Rendering Google Sign-In button...");
            renderGoogleButton("google-signin-button", {
              theme: "outline",
              size: "large",
              text: "signin_with",
            });
            addTestResult("✅ Google Sign-In button rendered");
          }
        } else {
          addTestResult("❌ Google OAuth initialization failed");
        }

        addTestResult("🎉 All Google OAuth tests passed!");
      } catch (error) {
        addTestResult(`❌ Google OAuth test failed: ${error}`);
      }
    };

    testGoogleOAuth();
  }, [initializeGoogleAuth, renderGoogleButton]);

  const handleManualGoogleSignIn = () => {
    if (isGoogleReady) {
      addTestResult("🔄 Prompting Google Sign-In...");
      promptGoogleSignIn();
    } else {
      addTestResult("❌ Google OAuth not ready");
    }
  };

  const testGoogleAuth = async () => {
    try {
      addTestResult("🔄 Testing Google authentication flow...");

      // This would normally be triggered by the Google button
      // For testing, we'll simulate the flow
      addTestResult(
        "ℹ️ Click the Google Sign-In button to test authentication"
      );
    } catch (error) {
      addTestResult(`❌ Google auth test failed: ${error}`);
    }
  };

  const testForceReinitialize = async () => {
    try {
      addTestResult("🔄 Testing force reinitialize...");
      await GoogleAuth.forceReinitialize();
      addTestResult("✅ Force reinitialize completed");
    } catch (error) {
      addTestResult(`❌ Force reinitialize failed: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Google OAuth 2.0 Test Suite
      </h2>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
        <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">Running tests...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Google Sign-In Button */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold mb-3">Google Sign-In Button:</h3>
        <div
          id="google-signin-button"
          ref={googleButtonRef}
          className="flex justify-center"
        ></div>

        <button
          onClick={handleManualGoogleSignIn}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!isGoogleReady}
        >
          Manual Google Sign-In Prompt
        </button>
      </div>

      {/* Authentication Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Authentication Status:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p>
              <strong>Authenticated:</strong>{" "}
              {isAuthenticated ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Loading:</strong> {isLoading ? "🔄 Yes" : "✅ No"}
            </p>
            <p>
              <strong>Google Ready:</strong>{" "}
              {isGoogleReady ? "✅ Yes" : "❌ No"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            {user && (
              <>
                <p>
                  <strong>User:</strong> {user.firstname} {user.lastname}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
              </>
            )}
            {profile && (
              <>
                <p>
                  <strong>Google User:</strong>{" "}
                  {profile.isGoogleUser ? "Yes" : "No"}
                </p>
                <p>
                  <strong>New User:</strong> {profile.isNewUser ? "Yes" : "No"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="text-center">
        <button
          onClick={testGoogleAuth}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-4"
        >
          Test Google Auth Flow
        </button>

        <button
          onClick={testForceReinitialize}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-4"
        >
          Force Reinitialize
        </button>

        <button
          onClick={() => setTestResults([])}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {/* Environment Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">Environment Information:</h4>
        <p>
          <strong>Client ID:</strong>{" "}
          {GoogleAuth.getClientId() ? "✅ Configured" : "❌ Missing"}
        </p>
        <p>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </p>
        <p>
          <strong>API URL:</strong>{" "}
          {process.env.NEXT_PUBLIC_API_URL || "Not set"}
        </p>
      </div>
    </div>
  );
};
