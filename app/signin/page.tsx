"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useAuthContext } from "@/services/auth/auth-context";
import "@/styles/google-signin.css";

export default function SignInPage() {
  const router = useRouter();
  const {
    login,
    googleAuth,
    isLoading,
    initializeGoogleAuth,
    googleLoading,
    renderGoogleButton,
  } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Google Auth and render button on component mount
  useEffect(() => {
    const initAndRender = async () => {
      try {
        await initializeGoogleAuth();

        renderGoogleButton("google-signin-button", {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "center",
          width: 320,
        });

        // Apply custom styling after button renders
        setTimeout(() => {
          const googleButton = document.querySelector(
            "#google-signin-button iframe"
          );
          if (googleButton) {
            // Add custom classes or styles
            (googleButton as HTMLElement).style.borderRadius = "12px";
            (googleButton as HTMLElement).style.boxShadow =
              "0 4px 12px rgba(0, 0, 0, 0.15)";
            (googleButton as HTMLElement).style.transition = "all 0.3s ease";
          }
        }, 100);
      } catch (error) {
        console.error("Failed to initialize Google Auth:", error);
      }
    };

    initAndRender();
  }, [initializeGoogleAuth, renderGoogleButton]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Sign in failed");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-noki-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-2xl">
                N
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-poppins font-bold text-foreground text-center mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground font-roboto text-center mb-8">
            Sign in to continue to Noki
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm font-roboto">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-roboto font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-roboto font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-roboto text-foreground">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-noki-primary hover:underline font-roboto"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full px-4 py-3 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 my-4 bg-card text-muted-foreground font-roboto">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button Container */}
          <div className="w-full">
            {googleLoading ? (
              <div className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground font-roboto font-medium flex items-center justify-center gap-3 opacity-50">
                <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                Signing in with Google...
              </div>
            ) : (
              <div
                id="google-signin-button"
                className="w-full flex items-center justify-center google-signin-container"
              ></div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-roboto text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-noki-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
