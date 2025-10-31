import {
  AIService,
  Conversation,
  ConversationHistoryResponse,
  NewConversationResponse,
  ChatRequest,
  ChatResponse,
  ConversationUpdateResponse,
  DeleteConversationResponse,
  ApiResponse,
} from "../types";
import { HttpClient } from "../http";

/**
 * AI Service implementation
 *
 * This service handles all AI-related operations:
 * - Get all conversations for the user
 * - Create a new conversation
 * - Send chat messages
 * - Rename conversations
 * - Delete conversations
 *
 * All endpoints require a Bearer token with JWT access token.
 * The user ID is automatically extracted from the JWT token.
 */
export class AIServiceImpl implements AIService {
  readonly baseUrl = "/ai";
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get all conversations for the current user
   * GET /ai/get_all_conversations
   *
   * @returns Array of conversations with metadata
   */
  async getAllConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.httpClient.get<Conversation[]>(
      `${this.baseUrl}/get_all_conversations`
    );
  }

  /**
   * Get conversation history for a specific conversation
   * GET /ai/get_conversation_history/:conversation_id
   *
   * @param conversationId The ID of the conversation
   * @returns Conversation with full message history and metadata
   */
  async getConversationHistory(
    conversationId: string
  ): Promise<ApiResponse<ConversationHistoryResponse>> {
    return this.httpClient.get<ConversationHistoryResponse>(
      `${this.baseUrl}/get_conversation_history/${conversationId}`
    );
  }

  /**
   * Create a new conversation
   * POST /ai/new_conversation
   *
   * @returns The newly created conversation ID
   */
  async newConversation(): Promise<ApiResponse<NewConversationResponse>> {
    return this.httpClient.post<NewConversationResponse>(
      `${this.baseUrl}/new_conversation`
    );
  }

  /**
   * Send a chat message and get AI response
   * POST /ai/chat
   *
   * @param data Chat request containing conversation ID, prompt, and optional context
   * @returns AI response with text, blocks, and token usage
   */
  async chat(data: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.httpClient.post<ChatResponse>(`${this.baseUrl}/chat`, data);
  }

  /**
   * Rename an existing conversation
   * PATCH /ai/rename_conversation/:conversation_id
   *
   * @param conversationId The ID of the conversation to rename
   * @param title The new title for the conversation
   * @returns Updated conversation metadata
   */
  async renameConversation(
    conversationId: string,
    title: string
  ): Promise<ApiResponse<ConversationUpdateResponse>> {
    return this.httpClient.patch<ConversationUpdateResponse>(
      `${this.baseUrl}/rename_conversation/${conversationId}`,
      { title }
    );
  }

  /**
   * Delete a conversation
   * DELETE /ai/delete_conversation/:conversation_id
   *
   * @param conversationId The ID of the conversation to delete
   * @returns Success message with deleted conversation ID
   */
  async deleteConversation(
    conversationId: string
  ): Promise<ApiResponse<DeleteConversationResponse>> {
    return this.httpClient.delete<DeleteConversationResponse>(
      `${this.baseUrl}/delete_conversation/${conversationId}`
    );
  }
}
