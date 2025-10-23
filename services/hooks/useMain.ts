import { useState, useCallback } from "react";
import { MainService, AllUserData, CachedData, ApiResponse } from "../types";
import { getMainService } from "../index";

/**
 * Main hook for managing all user data
 *
 * This hook fetches and manages:
 * - Projects
 * - Tasks
 * - Todos
 */
export const useMain = () => {
  const [allUserData, setAllUserData] = useState<AllUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mainService = getMainService();

  /**
   * Fetches all user data (projects, tasks, todos)
   * Automatically stores in localStorage with timestamp
   */
  const fetchAllUserData =
    useCallback(async (): Promise<AllUserData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await mainService.getAllUserData();
        if (response.success && response.data) {
          setAllUserData(response.data);
          return response.data;
        } else {
          setError(response.message || "Failed to fetch user data");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch all user data";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [mainService]);

  /**
   * Gets cached data from Cache Storage
   */
  const getCachedData = useCallback(async (): Promise<CachedData | null> => {
    return await mainService.getCachedData();
  }, [mainService]);

  /**
   * Clears cached data from Cache Storage
   */
  const clearCachedData = useCallback(async (): Promise<void> => {
    await mainService.clearCachedData();
    setAllUserData(null);
  }, [mainService]);

  /**
   * Gets the age of cached data in milliseconds
   * Returns null if no cache exists
   */
  const getCacheAge = useCallback(async (): Promise<number | null> => {
    return await mainService.getCacheAge();
  }, [mainService]);

  /**
   * Loads cached data into state
   */
  const loadFromCache = useCallback(async (): Promise<boolean> => {
    const cached = await mainService.getCachedData();
    if (cached && cached.data) {
      setAllUserData(cached.data);
      return true;
    }
    return false;
  }, [mainService]);

  /**
   * Get direct access to IndexedDB service for CRUD operations
   */
  const getDB = useCallback(() => {
    return mainService.getDB();
  }, [mainService]);

  /**
   * Get data in nested structure (projects > tasks > todos)
   * Useful for displaying hierarchical data in UI
   */
  const getNestedData = useCallback(async () => {
    const db = mainService.getDB();
    return await db.getAllDataNested();
  }, [mainService]);

  return {
    allUserData,
    isLoading,
    error,
    fetchAllUserData,
    getCachedData,
    clearCachedData,
    getCacheAge,
    loadFromCache,
    getDB,
    getNestedData,
    setError,
  };
};
