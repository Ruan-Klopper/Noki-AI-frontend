import { useState, useEffect, useCallback } from "react";
import {
  ProjectService,
  Project,
  CreateProjectData,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "../types";
import { getProjectService } from "../index";

// Project hook for managing project state
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Project>["pagination"] | null
  >(null);

  const projectService = getProjectService();

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

      try {
        const response = await projectService.createProject(data);
        if (response.success) {
          setProjects((prev) => [response.data, ...prev]);
          return response.data;
        }
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create project"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService]
  );

  const updateProject = useCallback(
    async (id: string, data: Partial<Project>): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await projectService.updateProject(id, data);
        if (response.success) {
          setProjects((prev) =>
            prev.map((project) => (project.id === id ? response.data : project))
          );
          return response.data;
        }
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update project"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await projectService.deleteProject(id);
        if (response.success) {
          setProjects((prev) => prev.filter((project) => project.id !== id));
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete project"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [projectService]
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
