import {
  ServiceFactory,
  AuthService,
  UserService,
  ProjectService,
  TaskService,
  TodoService,
  TimetableService,
  CanvasService,
  MainService,
  AIService,
} from "../types";
import { HttpClient, createHttpClient } from "../http";
import { AuthServiceImpl } from "../auth/auth.service";
import { UserServiceImpl } from "../user/user.service";
import { ProjectServiceImpl } from "../project/project.service";
import { TaskServiceImpl } from "../task/task.service";
import { TodoServiceImpl } from "../todo/todo.service";
import { TimetableServiceImpl } from "../timetable/timetable.service";
import { CanvasServiceImpl } from "../canvas/canvas.service";
import { MainServiceImpl } from "../main/main.service";
import { AIServiceImpl } from "../ai/ai.service";

// Service Factory implementation following Dependency Inversion Principle
export class ServiceFactoryImpl implements ServiceFactory {
  private httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient || createHttpClient();
  }

  createAuthService(): AuthService {
    return new AuthServiceImpl(this.httpClient);
  }

  createUserService(): UserService {
    return new UserServiceImpl(this.httpClient);
  }

  createProjectService(): ProjectService {
    return new ProjectServiceImpl(this.httpClient);
  }

  createTaskService(): TaskService {
    return new TaskServiceImpl(this.httpClient);
  }

  createTodoService(): TodoService {
    return new TodoServiceImpl(this.httpClient);
  }

  createTimetableService(): TimetableService {
    return new TimetableServiceImpl(this.httpClient);
  }

  createCanvasService(): CanvasService {
    // Canvas service creates its own HTTP client with extended timeout
    // Do NOT pass the factory's httpClient
    return new CanvasServiceImpl();
  }

  createMainService(): MainService {
    // Main service creates its own HTTP client with extended timeout (5 minutes)
    // Do NOT pass the factory's httpClient
    return new MainServiceImpl();
  }

  createAIService(): AIService {
    return new AIServiceImpl(this.httpClient);
  }
}

// Singleton service factory instance
let serviceFactoryInstance: ServiceFactory | null = null;

export const getServiceFactory = (): ServiceFactory => {
  if (!serviceFactoryInstance) {
    serviceFactoryInstance = new ServiceFactoryImpl();
  }
  return serviceFactoryInstance;
};

// Factory function for creating new instances
export const createServiceFactory = (
  httpClient?: HttpClient
): ServiceFactory => {
  return new ServiceFactoryImpl(httpClient);
};

// Convenience functions for getting services directly
export const getAuthService = (): AuthService => {
  return getServiceFactory().createAuthService();
};

export const getUserService = (): UserService => {
  return getServiceFactory().createUserService();
};

export const getProjectService = (): ProjectService => {
  return getServiceFactory().createProjectService();
};

export const getTimetableService = (): TimetableService => {
  return getServiceFactory().createTimetableService();
};

export const getCanvasService = (): CanvasService => {
  return getServiceFactory().createCanvasService();
};

export const getMainService = (): MainService => {
  return getServiceFactory().createMainService();
};

export const getTaskService = (): TaskService => {
  return getServiceFactory().createTaskService();
};

export const getTodoService = (): TodoService => {
  return getServiceFactory().createTodoService();
};

export const getAIService = (): AIService => {
  return getServiceFactory().createAIService();
};
