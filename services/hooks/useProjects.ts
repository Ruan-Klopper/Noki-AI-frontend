import { useState, useEffect, useCallback } from "react";
import {
  ProjectService,
  Project,
  CreateProjectData,
  UpdateProjectData,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "../types";
import { getProjectService } from "../index";
import { notificationService } from "../notification/notification.service";
import { getIndexedDBService } from "../storage/indexeddb.service";

// Project hook for managing project state
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Project>["pagination"] | null
  >(null);

  const projectService = getProjectService();
  const dbService = getIndexedDBService();

  const fetchProjects = useCallback(
    async (params?: PaginationParams): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await projectService.getProjects(params);
        if (response.success) {
          setProjects(response.data);
          setPagination(response.pagination);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [projectService]
  );

  const createProject = useCallback(
    async (data: CreateProjectData): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);

      // Show loading notification
      const loadingKey = `create-project-${Date.now()}`;
      notificationService.info("Creating project...", "Please wait", 0);

      try {
        const response = await projectService.createProject(data);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveProject(response.data);

          // Update local state
          setProjects((prev) => [response.data, ...prev]);

          // Show success notification
          notificationService.success(
            "Project created!",
            `${response.data.title} has been created successfully`
          );

          return response.data;
        }

        notificationService.error(
          "Failed to create project",
          response.message || "Please try again"
        );
        return null;
      } catch (err) {
        notificationService.destroy();
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create project";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService, dbService]
  );

  const updateProject = useCallback(
    async (
      id: string,
      data: Partial<UpdateProjectData>
    ): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Updating project...", "Please wait", 0);

      try {
        const response = await projectService.updateProject(id, data);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Update IndexedDB
          await dbService.saveProject(response.data);

          // Update local state
          setProjects((prev) =>
            prev.map((project) => (project.id === id ? response.data : project))
          );

          // Show success notification
          notificationService.success(
            "Project updated!",
            `${response.data.title} has been updated successfully`
          );

          return response.data;
        }

        notificationService.error(
          "Failed to update project",
          response.message || "Please try again"
        );
        return null;
      } catch (err) {
        notificationService.destroy();
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update project";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService, dbService]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      // Show loading notification
      notificationService.info("Deleting project...", "Please wait", 0);

      try {
        const response = await projectService.deleteProject(id);

        // Destroy loading notification
        notificationService.destroy();

        if (response.success) {
          // Delete from IndexedDB
          await dbService.deleteProject(id);

          // Update local state
          setProjects((prev) => prev.filter((project) => project.id !== id));

          // Show success notification
          notificationService.success(
            "Project deleted!",
            `${response.data.title} has been deleted successfully`
          );

          return true;
        }

        notificationService.error(
          "Failed to delete project",
          response.message || "Please try again"
        );
        return false;
      } catch (err) {
        notificationService.destroy();
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete project";
        setError(errorMessage);
        notificationService.error("Error", errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService, dbService]
  );

  const getProject = useCallback(
    async (id: string): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await projectService.getProject(id);
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService]
  );

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    setError,
  };
};
