import {
  TaskService,
  Task,
  CreateTaskData,
  UpdateTaskData,
  ApiResponse,
} from "../types";
import { HttpClient } from "../http";

/**
 * Task Service implementation
 *
 * This service handles all task-related operations:
 * - Create task
 * - Update task
 * - Delete task
 * - Complete task (marks is_submitted as true)
 */
export class TaskServiceImpl implements TaskService {
  readonly baseUrl = "/tasks";
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new task
   * POST /tasks/create_task
   */
  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    return this.httpClient.post<Task>(`${this.baseUrl}/create_task`, data);
  }

  /**
   * Update an existing task
   * PUT /tasks/update_task/:id
   */
  async updateTask(
    id: string,
    data: Partial<UpdateTaskData>
  ): Promise<ApiResponse<Task>> {
    return this.httpClient.put<Task>(`${this.baseUrl}/update_task/${id}`, data);
  }

  /**
   * Delete a task
   * DELETE /tasks/delete_task/:id
   */
  async deleteTask(id: string): Promise<ApiResponse<Task>> {
    return this.httpClient.delete<Task>(`${this.baseUrl}/delete_task/${id}`);
  }

  /**
   * Complete a task (marks is_submitted as true)
   * PUT /tasks/complete_task/:id
   */
  async completeTask(id: string): Promise<ApiResponse<Task>> {
    return this.httpClient.put<Task>(`${this.baseUrl}/complete_task/${id}`);
  }
}
