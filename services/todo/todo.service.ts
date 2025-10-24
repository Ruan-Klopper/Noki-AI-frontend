import {
  TodoService,
  Todo,
  CreateTodoData,
  UpdateTodoData,
  UpdateTodosResponse,
  DeleteTodosResponse,
  ApiResponse,
} from "../types";
import { HttpClient } from "../http";

/**
 * Todo Service implementation
 *
 * This service handles all todo-related operations:
 * - Create todo (associated with a task)
 * - Update todo(s) (supports bulk updates)
 * - Delete todo(s) (supports bulk deletes)
 * - Complete todo (marks is_submitted as true)
 */
export class TodoServiceImpl implements TodoService {
  readonly baseUrl = "/todos";
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new todo for a specific task
   * POST /todos/create_todo/:taskId
   */
  async createTodo(
    taskId: string,
    data: CreateTodoData
  ): Promise<ApiResponse<Todo>> {
    return this.httpClient.post<Todo>(
      `${this.baseUrl}/create_todo/${taskId}`,
      data
    );
  }

  /**
   * Update multiple todos at once
   * PUT /todos/update_todo
   *
   * Body: { todoIds: string[], updates: Partial<UpdateTodoData> }
   */
  async updateTodos(
    todoIds: string[],
    updates: Partial<UpdateTodoData>
  ): Promise<ApiResponse<UpdateTodosResponse>> {
    return this.httpClient.put<UpdateTodosResponse>(
      `${this.baseUrl}/update_todo`,
      {
        todoIds,
        updates,
      }
    );
  }

  /**
   * Delete multiple todos at once
   * DELETE /todos/delete_todo
   *
   * Body: { todoIds: string[] }
   */
  async deleteTodos(
    todoIds: string[]
  ): Promise<ApiResponse<DeleteTodosResponse>> {
    // Note: DELETE requests typically don't have a body, but this API expects one
    // We'll use the httpClient's delete method which now supports this
    return this.httpClient.delete<DeleteTodosResponse>(
      `${this.baseUrl}/delete_todo`,
      { todoIds }
    );
  }

  /**
   * Complete a todo (marks is_submitted as true)
   * PUT /todos/complete_todo/:id
   */
  async completeTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.httpClient.put<Todo>(`${this.baseUrl}/complete_todo/${id}`);
  }
}
