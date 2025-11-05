"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Conversation, ConversationMessage } from "../types";
import { useAI } from "../hooks/useAI";
import {
  saveConversationsToCache,
  getConversationsFromCache,
} from "./conversation-cache";

interface ConversationContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: ConversationMessage[];
  isLoading: boolean;
  setActiveConversationId: (id: string | null) => void;
  loadConversations: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  addMessage: (message: ConversationMessage) => void;
  addConversation: (conversation: Conversation) => void;
  setIsLoading: (loading: boolean) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    getAllConversations,
    getConversationHistory,
    loading: aiLoading,
  } = useAI();

  /**
   * Load conversations from cache or API
   */
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Try cache first
      const cached = getConversationsFromCache();
      if (cached && cached.conversations.length > 0) {
        setConversations(cached.conversations);
      }

      // Always fetch fresh data from API
      const response = await getAllConversations();
      if (response?.success && response.data) {
        setConversations(response.data);
        saveConversationsToCache(response.data);
      } else if (cached && cached.conversations.length > 0) {
        // Keep cached data if API fails
        setConversations(cached.conversations);
      }
    } catch (error) {
      console.error(
        "[Conversation Context] Failed to load conversations:",
        error
      );
      // Try to use cached data on error
      const cached = getConversationsFromCache();
      if (cached && cached.conversations.length > 0) {
        setConversations(cached.conversations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load messages for active conversation
   */
  const refreshMessages = async () => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getConversationHistory(activeConversationId);
      if (response?.success && response.data) {
        // Extract messages array from the response
        setMessages(response.data.messages || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("[Conversation Context] Failed to load messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a message to the current conversation
   */
  const addMessage = (message: ConversationMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  /**
   * Add a new conversation to the list
   */
  const addConversation = (conversation: Conversation) => {
    setConversations((prev) => {
      const updated = [conversation, ...prev];
      saveConversationsToCache(updated);
      return updated;
    });
  };

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      refreshMessages();
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for conversation selection from sidenav and sync to sessionStorage
  useEffect(() => {
    const handleConversationSelected = (event: CustomEvent) => {
      const { conversationId } = event.detail;
      setActiveConversationId(conversationId);
    };

    // Check sessionStorage on mount for selected conversation
    if (typeof window !== "undefined") {
      const selectedId = sessionStorage.getItem("selectedConversationId");
      if (selectedId) {
        setActiveConversationId(selectedId);
        sessionStorage.removeItem("selectedConversationId");
      }

      // Listen for custom events from sidenav
      window.addEventListener(
        "conversationSelected",
        handleConversationSelected as EventListener
      );

      return () => {
        window.removeEventListener(
          "conversationSelected",
          handleConversationSelected as EventListener
        );
      };
    }
  }, [setActiveConversationId]);

  // Sync active conversation ID to sessionStorage so sidenav can read it
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeConversationId) {
        sessionStorage.setItem("activeConversationId", activeConversationId);
      } else {
        sessionStorage.removeItem("activeConversationId");
      }
    }
  }, [activeConversationId]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversationId,
        messages,
        isLoading: isLoading || aiLoading,
        setActiveConversationId,
        loadConversations,
        refreshMessages,
        addMessage,
        addConversation,
        setIsLoading,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
}
