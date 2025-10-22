"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useAuthContext } from "@/services/auth/auth-context";
import { Button, Input, Checkbox, Spin, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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
    showNotification,
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

    // Show loading notification
    showNotification(
      "info",
      "Signing in...",
      "Please wait while we authenticate your account"
    );

    try {
      const response = await login({ email, password });
      if (response.success) {
        showNotification(
          "success",
          "Welcome back!",
          "You have been successfully signed in"
        );
        router.push("/dashboard");
      } else {
        const errorMessage = response.message || "Sign in failed";
        setError(errorMessage);
        showNotification("error", "Sign in failed", errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign in";
      setError(errorMessage);
      showNotification("error", "Sign in failed", errorMessage);
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
            <Alert
              message="Sign in failed"
              description={error}
              type="error"
              icon={<ExclamationCircleOutlined />}
              showIcon
              className="mb-6"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#f8fafc",
              }}
            />
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-roboto font-medium text-foreground mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                prefix={<UserOutlined />}
                size="large"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-roboto font-medium text-foreground mb-2"
              >
                Password
              </label>
              <Input.Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                prefix={<LockOutlined />}
                size="large"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Checkbox className="font-roboto text-foreground">
                Remember me
              </Checkbox>
              <Link
                href="/forgot-password"
                className="text-noki-primary hover:underline font-roboto"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting || isLoading}
              size="large"
              className="w-full"
              icon={isSubmitting || isLoading ? <LoadingOutlined /> : undefined}
            >
              {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
            </Button>
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
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 20, color: "#1d72a6" }}
                      spin
                    />
                  }
                />
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
