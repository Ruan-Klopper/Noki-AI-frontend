"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/services/auth/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (isLoading) return;

    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      // If user is not authenticated, redirect to sign in
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-noki-primary animate-spin mx-auto" />
        <p className="text-xl font-poppins text-foreground">
          {isLoading ? "Checking authentication..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
