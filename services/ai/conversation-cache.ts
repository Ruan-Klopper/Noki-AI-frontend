/**
 * Conversation Cache Utility
 *
 * Stores conversations in localStorage for quick access
 */

const CONVERSATIONS_CACHE_KEY = "noki_conversations_cache";
const CACHE_TIMESTAMP_KEY = "noki_conversations_cache_timestamp";

export interface CachedConversations {
  conversations: any[];
  lastUpdated: string;
}

/**
 * Save conversations to localStorage cache
 */
export const saveConversationsToCache = (conversations: any[]): void => {
  if (typeof window === "undefined") return;

  const cache: CachedConversations = {
    conversations,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(CONVERSATIONS_CACHE_KEY, JSON.stringify(cache));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error("[Conversation Cache] Failed to save conversations:", error);
  }
};

/**
 * Get conversations from localStorage cache
 */
export const getConversationsFromCache = (): CachedConversations | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CONVERSATIONS_CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached) as CachedConversations;
  } catch (error) {
    console.error("[Conversation Cache] Failed to read conversations:", error);
    return null;
  }
};

/**
 * Clear conversations cache
 */
export const clearConversationsCache = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CONVERSATIONS_CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error("[Conversation Cache] Failed to clear cache:", error);
  }
};

/**
 * Get cache age in milliseconds
 */
export const getConversationsCacheAge = (): number | null => {
  if (typeof window === "undefined") return null;

  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;

    const cachedTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    return now - cachedTime;
  } catch (error) {
    console.error("[Conversation Cache] Failed to get cache age:", error);
    return null;
  }
};
