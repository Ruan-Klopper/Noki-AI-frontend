import {
  ProjectService,
  Project,
  CreateProjectData,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "../types";
import { HttpClient } from "../http";

// Project Service implementation following Single Responsibility Principle
export class ProjectServiceImpl implements ProjectService {
  readonly baseUrl = "/projects";
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getProjects(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Project>> {
    return this.httpClient.get<Project[]>(this.baseUrl, params) as Promise<
      PaginatedResponse<Project>
    >;
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.httpClient.get<Project>(`${this.baseUrl}/${id}`);
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return this.httpClient.post<Project>(this.baseUrl, data);
  }

  async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<ApiResponse<Project>> {
    return this.httpClient.patch<Project>(`${this.baseUrl}/${id}`, data);
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async duplicateProject(id: string): Promise<ApiResponse<Project>> {
    return this.httpClient.post<Project>(`${this.baseUrl}/${id}/duplicate`);
  }

  async archiveProject(id: string): Promise<ApiResponse<Project>> {
    return this.httpClient.patch<Project>(`${this.baseUrl}/${id}/archive`);
  }

  async restoreProject(id: string): Promise<ApiResponse<Project>> {
    return this.httpClient.patch<Project>(`${this.baseUrl}/${id}/restore`);
  }
}
