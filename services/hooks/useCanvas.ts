import { useState, useCallback } from "react";
import {
  CanvasSetupData,
  CanvasSetupResponse,
  CanvasLinkResponse,
} from "../types";
import { getCanvasService } from "../index";

// Canvas hook for managing Canvas integration
export const useCanvas = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [setupResponse, setSetupResponse] =
    useState<CanvasSetupResponse | null>(null);
  const [linkResponse, setLinkResponse] = useState<CanvasLinkResponse | null>(
    null
  );

  const canvasService = getCanvasService();

  /**
   * Step 1: Setup Canvas account
   * Sets up the Canvas account with institutional URL and token
   */
  const setupCanvas = useCallback(
    async (data: CanvasSetupData): Promise<CanvasSetupResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await canvasService.setupCanvas(data);
        if (response.success) {
          setSetupResponse(response.data);
          return response.data;
        }
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to setup Canvas account"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [canvasService]
  );

  /**
   * Step 2: Link Canvas data to Noki AI
   * Links the Canvas account data to the user's Noki account
   * Must be called after setupCanvas
   */
  const linkCanvasData =
    useCallback(async (): Promise<CanvasLinkResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await canvasService.linkCanvasData();
        if (response.success) {
          setLinkResponse(response.data);
          return response.data;
        }
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to link Canvas data"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [canvasService]);

  return {
    isLoading,
    error,
    setupResponse,
    linkResponse,
    setupCanvas,
    linkCanvasData,
    setError,
  };
};
