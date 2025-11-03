import { useState, useCallback } from "react";
import { getAIService } from "../factory";
import {
  Conversation,
  ConversationMessage,
  ConversationHistoryResponse,
  NewConversationResponse,
  ChatRequest,
  ChatResponse,
  ConversationUpdateResponse,
  DeleteConversationResponse,
  ApiResponse,
} from "../types";
import { notificationService } from "../notification/notification.service";

/**
 * Custom hook for AI operations
 *
 * Provides functions to:
 * - Get all conversations
 * - Create new conversation
 * - Send chat messages
 * - Rename conversation
 * - Delete conversation
 *
 * Automatically shows Ant Design error notifications on failure
 *
 * @returns AI service methods and loading/error state
 */
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const aiService = getAIService();

  /**
   * Get all conversations for the current user
   * - Shows error notification on failure
   */
  const getAllConversations = useCallback(async (): Promise<ApiResponse<
    Conversation[]
  > | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiService.getAllConversations();

      if (response.success) {
        return response;
      }

      notificationService.error(
        "Failed to load conversations",
        response.message || "Please try again"
      );
      return response;
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to load conversations. Please try again.";
      setError(errorMessage);
      notificationService.error("Error", errorMessage);
      console.error("Error loading conversations:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [aiService]);

  /**
   * Get conversation history for a specific conversation
   * - Shows error notification on failure
   */
  const getConversationHistory = useCallback(
    async (
      conversationId: string
    ): Promise<ApiResponse<ConversationHistoryResponse> | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.getConversationHistory(conversationId);

        if (response.success) {
          return response;
        }

        notificationService.error(
          "Failed to load conversation",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to load conversation. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error loading conversation history:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [aiService]
  );

  /**
   * Create a new conversation
   * - Shows error notification on failure
   */
  const newConversation =
    useCallback(async (): Promise<ApiResponse<NewConversationResponse> | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.newConversation();

        if (response.success) {
          return response;
        }

        notificationService.error(
          "Failed to create conversation",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to create conversation. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error creating conversation:", err);
        return null;
      } finally {
        setLoading(false);
      }
    }, [aiService]);

  /**
   * Send a chat message and get AI response
   * - Shows error notification on failure
   */
  const chat = useCallback(
    async (data: ChatRequest): Promise<ApiResponse<ChatResponse> | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.chat(data);

        if (response.success) {
          return response;
        }

        notificationService.error(
          "Failed to send message",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to send message. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error sending chat message:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [aiService]
  );

  /**
   * Rename a conversation
   * - Shows error notification on failure
   */
  const renameConversation = useCallback(
    async (
      conversationId: string,
      title: string
    ): Promise<ApiResponse<ConversationUpdateResponse> | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.renameConversation(
          conversationId,
          title
        );

        if (response.success) {
          return response;
        }

        notificationService.error(
          "Failed to rename conversation",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to rename conversation. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error renaming conversation:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [aiService]
  );

  /**
   * Delete a conversation
   * - Shows error notification on failure
   */
  const deleteConversation = useCallback(
    async (
      conversationId: string
    ): Promise<ApiResponse<DeleteConversationResponse> | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.deleteConversation(conversationId);

        if (response.success) {
          return response;
        }

        notificationService.error(
          "Failed to delete conversation",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.message || "Failed to delete conversation. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error deleting conversation:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [aiService]
  );

  return {
    getAllConversations,
    getConversationHistory,
    newConversation,
    chat,
    renameConversation,
    deleteConversation,
    loading,
    error,
  };
};
