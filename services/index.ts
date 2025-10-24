// Main services export file - Single entry point for all services
export * from "./types";
export * from "./http";
export * from "./factory";
export * from "./env";
export * from "./hooks";

// Service implementations
export { AuthServiceImpl } from "./auth/auth.service";
export { UserServiceImpl } from "./user/user.service";
export { ProjectServiceImpl } from "./project/project.service";
export { TaskServiceImpl } from "./task/task.service";
export { TodoServiceImpl } from "./todo/todo.service";
export { TimetableServiceImpl } from "./timetable/timetable.service";
export { CanvasServiceImpl } from "./canvas/canvas.service";
export { MainServiceImpl } from "./main/main.service";

// Storage services
export {
  IndexedDBService,
  getIndexedDBService,
} from "./storage/indexeddb.service";

// Auth components
export { GoogleAuth } from "./auth/google-auth";
export { AuthProvider, useAuthContext, withAuth } from "./auth/auth-context";

// Convenience exports for common usage
export {
  getServiceFactory,
  createServiceFactory,
  getAuthService,
  getUserService,
  getProjectService,
  getTaskService,
  getTodoService,
  getTimetableService,
  getCanvasService,
  getMainService,
} from "./factory";

export { getHttpClient, createHttpClient } from "./http";

export {
  getApiConfig,
  TokenManager,
  ApiException,
  CookieManager,
} from "./config";

export { ENV, validateEnvironment } from "./env";
