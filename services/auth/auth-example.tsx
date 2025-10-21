"use client";

import React, { useEffect, useRef } from "react";
import { useAuthContext } from "@/services";

// Example authentication component
export const AuthExample: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    profile,
    login,
    register,
    logout,
    renderGoogleButton,
    promptGoogleSignIn,
  } = useAuthContext();

  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Render Google button when component mounts
  useEffect(() => {
    if (googleButtonRef.current && !isLoading) {
      renderGoogleButton("google-signin-button", {
        theme: "outline",
        size: "large",
        text: "signin_with",
      });
    }
  }, [renderGoogleButton, isLoading]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await login({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await register({
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstname}!</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">User Information:</h3>
          <p>
            <strong>Name:</strong> {user?.firstname} {user?.lastname}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>ID:</strong> {user?.id}
          </p>
        </div>

        {profile && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Profile Information:</h3>
            <p>
              <strong>User ID:</strong> {profile.userId}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Google User:</strong>{" "}
              {profile.isGoogleUser ? "Yes" : "No"}
            </p>
            <p>
              <strong>New User:</strong> {profile.isNewUser ? "Yes" : "No"}
            </p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Noki AI Authentication
      </h2>

      {/* Google Sign-In */}
      <div className="mb-6">
        <div id="google-signin-button" ref={googleButtonRef}></div>
        <button
          onClick={promptGoogleSignIn}
          className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Or click here for Google Sign-In
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Login</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Register</h3>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="register-firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="register-firstname"
                name="firstname"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="register-lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="register-lastname"
                name="lastname"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="register-password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
