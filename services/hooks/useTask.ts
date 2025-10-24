import { useState, useCallback } from "react";
import { getTaskService } from "../factory";
import { Task, CreateTaskData, UpdateTaskData, ApiResponse } from "../types";
import { notificationService } from "../notification/notification.service";
import { getIndexedDBService } from "../storage/indexeddb.service";

/**
 * Custom hook for task operations
 *
 * Provides functions to:
 * - Create task
 * - Update task
 * - Delete task
 * - Complete task
 *
 * Automatically updates IndexedDB and shows Ant Design notifications
 *
 * @returns Task service methods and loading/error state
 */
export const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const taskService = getTaskService();
  const dbService = getIndexedDBService();

  /**
   * Create a new task
   * - Shows loading notification
   * - Updates IndexedDB on success
   * - Shows success/error notification
   */
  const createTask = useCallback(
    async (data: CreateTaskData): Promise<ApiResponse<Task> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Creating task...", "Please wait", 0);

      try {
        const response = await taskService.createTask(data);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveTask(response.data);

          // Show success notification
          notificationService.success(
            "Task created!",
            `${response.data.title} has been created successfully`
          );

          return response;
        }

        notificationService.error(
          "Failed to create task",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to create task. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error creating task:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [taskService, dbService]
  );

  /**
   * Update an existing task
   * - Shows loading notification
   * - Updates IndexedDB on success
   * - Shows success/error notification
   */
  const updateTask = useCallback(
    async (
      id: string,
      data: Partial<UpdateTaskData>
    ): Promise<ApiResponse<Task> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Updating task...", "Please wait", 0);

      try {
        const response = await taskService.updateTask(id, data);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveTask(response.data);

          // Show success notification
          notificationService.success(
            "Task updated!",
            `${response.data.title} has been updated successfully`
          );

          return response;
        }

        notificationService.error(
          "Failed to update task",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to update task. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error updating task:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [taskService, dbService]
  );

  /**
   * Delete a task
   * - Shows loading notification
   * - Deletes from IndexedDB on success
   * - Shows success/error notification
   */
  const deleteTask = useCallback(
    async (id: string): Promise<ApiResponse<Task> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Deleting task...", "Please wait", 0);

      try {
        const response = await taskService.deleteTask(id);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Delete from IndexedDB
          await dbService.deleteTask(id);

          // Show success notification
          notificationService.success(
            "Task deleted!",
            `${response.data.title} has been deleted successfully`
          );

          return response;
        }

        notificationService.error(
          "Failed to delete task",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to delete task. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error deleting task:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [taskService, dbService]
  );

  /**
   * Complete a task (marks is_submitted as true)
   * - Shows loading notification
   * - Updates IndexedDB on success
   * - Shows success/error notification
   */
  const completeTask = useCallback(
    async (id: string): Promise<ApiResponse<Task> | null> => {
      setLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Completing task...", "Please wait", 0);

      try {
        const response = await taskService.completeTask(id);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveTask(response.data);

          // Show success notification
          notificationService.success(
            "Task completed!",
            `${response.data.title} has been marked as complete`
          );

          return response;
        }

        notificationService.error(
          "Failed to complete task",
          response.message || "Please try again"
        );
        return response;
      } catch (err: any) {
        notificationService.destroy();
        const errorMessage =
          err?.message || "Failed to complete task. Please try again.";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        console.error("Error completing task:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [taskService, dbService]
  );

  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error,
  };
};
