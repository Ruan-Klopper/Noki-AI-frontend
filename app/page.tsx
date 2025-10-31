"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/services/auth/auth-context";
import { useMain } from "@/services";
import { useAI } from "@/services/hooks";
import { saveConversationsToCache } from "@/services/ai/conversation-cache";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { fetchAllUserData, isLoading: dataLoading, error } = useMain();
  const { getAllConversations } = useAI();
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // Don't proceed while authentication is still loading
    if (authLoading) return;

    // If user is not authenticated, redirect to sign in
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    // If user is authenticated and data hasn't been fetched yet
    if (isAuthenticated && !dataFetched) {
      const fetchData = async () => {
        try {
          console.log("[Home Page] Fetching all user data...");
          await fetchAllUserData();
          console.log("[Home Page] All user data fetched successfully");

          // Fetch and cache conversations
          console.log("[Home Page] Fetching conversations...");
          try {
            const conversationsResponse = await getAllConversations();
            if (conversationsResponse?.success && conversationsResponse.data) {
              saveConversationsToCache(conversationsResponse.data);
              console.log(
                "[Home Page] Conversations cached successfully:",
                conversationsResponse.data.length
              );
            }
          } catch (convErr) {
            console.error("[Home Page] Error fetching conversations:", convErr);
            // Continue even if conversations fail to load
          }

          setDataFetched(true);
          // Redirect to dashboard after successful data fetch
          router.push("/dashboard");
        } catch (err) {
          console.error("[Home Page] Error fetching user data:", err);
          // Still redirect to dashboard even if there's an error
          // The user can still use the app with empty/partial data
          setDataFetched(true);
          router.push("/dashboard");
        }
      };

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, dataFetched]);

  // Show loading state
  const isLoading =
    authLoading || dataLoading || (isAuthenticated && !dataFetched);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-noki-primary animate-spin mx-auto" />
        <div className="space-y-2">
          <p className="text-xl font-poppins text-foreground">
            {authLoading
              ? "Checking authentication..."
              : dataLoading
              ? "Loading your data..."
              : "Redirecting..."}
          </p>
          {dataLoading && (
            <p className="text-sm font-roboto text-muted-foreground">
              This may take a few moments...
            </p>
          )}
          {error && <p className="text-sm font-roboto text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
