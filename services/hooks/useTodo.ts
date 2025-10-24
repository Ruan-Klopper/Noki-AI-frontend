import { useState, useCallback } from "react";
import { getTodoService } from "../factory";
import {
  Todo,
  CreateTodoData,
  UpdateTodoData,
  UpdateTodosResponse,
  DeleteTodosResponse,
  ApiResponse,
} from "../types";
import { notificationService } from "../notification/notification.service";
import { getIndexedDBService } from "../storage/indexeddb.service";

/**
 * Custom hook for todo operations
 *
 * Provides functions to:
 * - Create todo (associated with a task)
 * - Update todo(s) (supports bulk updates)
 * - Delete todo(s) (supports bulk deletes)
 * - Complete todo
 *
 * Automatically updates IndexedDB and shows Ant Design notifications
 *
 * @returns Todo service methods and loading/error state
 */
export const useTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todoService = getTodoService();
  const dbService = getIndexedDBService();

  /**
   * Create a new todo for a specific task
   * - Shows loading notification
   * - Updates IndexedDB on success
   * - Shows success/error notification
   */
  const createTodo = useCallback(
    async (
      taskId: string,
      data: CreateTodoData
    ): Promise<ApiResponse<Todo> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Creating todo...", "Please wait", 0);

      try {
        const response = await todoService.createTodo(taskId, data);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveTodo(response.data);

          // Show success notification
          notificationService.success(
            "Todo created!",
            `${response.data.title} has been created successfully`
          );

          return response;
        }

        notificationService.error(
          "Failed to create todo",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to create todo. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error creating todo:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [todoService, dbService]
  );

  /**
   * Update multiple todos at once (bulk operation)
   * - Shows loading notification
   * - Updates IndexedDB for each todo on success
   * - Shows success/error notification
   */
  const updateTodos = useCallback(
    async (
      todoIds: string[],
      updates: Partial<UpdateTodoData>
    ): Promise<ApiResponse<UpdateTodosResponse> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      const count = todoIds.length;
      notificationService.info(
        `Updating ${count} todo${count > 1 ? "s" : ""}...`,
        "Please wait",
        0
      );

      try {
        const response = await todoService.updateTodos(todoIds, updates);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB for each updated todo
          await Promise.all(
            response.data.todos.map((todo) => dbService.saveTodo(todo))
          );

          // Show success notification
          notificationService.success(
            "Todos updated!",
            `${response.data.updated} todo${
              response.data.updated > 1 ? "s" : ""
            } updated successfully`
          );

          return response;
        }

        notificationService.error(
          "Failed to update todos",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to update todos. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error updating todos:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [todoService, dbService]
  );

  /**
   * Delete multiple todos at once (bulk operation)
   * - Shows loading notification
   * - Deletes from IndexedDB for each todo on success
   * - Shows success/error notification
   */
  const deleteTodos = useCallback(
    async (
      todoIds: string[]
    ): Promise<ApiResponse<DeleteTodosResponse> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      const count = todoIds.length;
      notificationService.info(
        `Deleting ${count} todo${count > 1 ? "s" : ""}...`,
        "Please wait",
        0
      );

      try {
        const response = await todoService.deleteTodos(todoIds);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Delete from IndexedDB for each deleted todo
          await Promise.all(
            response.data.todoIds.map((todoId) => dbService.deleteTodo(todoId))
          );

          // Show success notification
          notificationService.success(
            "Todos deleted!",
            `${response.data.deleted} todo${
              response.data.deleted > 1 ? "s" : ""
            } deleted successfully`
          );

          return response;
        }

        notificationService.error(
          "Failed to delete todos",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to delete todos. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error deleting todos:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [todoService, dbService]
  );

  /**
   * Complete a todo (marks is_submitted as true)
   * - Shows loading notification
   * - Updates IndexedDB on success
   * - Shows success/error notification
   */
  const completeTodo = useCallback(
    async (id: string): Promise<ApiResponse<Todo> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Completing todo...", "Please wait", 0);

      try {
        const response = await todoService.completeTodo(id);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveTodo(response.data);

          // Show success notification
          notificationService.success(
            "Todo completed!",
            `${response.data.title} has been marked as complete`
          );

          return response;
        }

        notificationService.error(
          "Failed to complete todo",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to complete todo. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error completing todo:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [todoService, dbService]
  );

  return {
    createTodo,
    updateTodos,
    deleteTodos,
    completeTodo,
    loading,
    error,
  };
};
