// Base types and interfaces for the services layer
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Base service interface following Interface Segregation Principle
export interface BaseService {
  readonly baseUrl: string;
}

// HTTP methods interface
export interface HttpService {
  get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

// Configuration interface
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

// Service factory interface for dependency injection
export interface ServiceFactory {
  createAuthService(): AuthService;
  createUserService(): UserService;
  createProjectService(): ProjectService;
  createTimetableService(): TimetableService;
  createCanvasService(): CanvasService;
  createMainService(): MainService;
}

// Forward declarations for service interfaces
export interface AuthService extends BaseService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>>;
  register(userData: RegisterData): Promise<ApiResponse<AuthTokens>>;
  logout(): Promise<ApiResponse<void>>;
  getProfile(): Promise<ApiResponse<AuthProfile>>;
  googleAuth(idToken: string): Promise<ApiResponse<AuthTokens>>;
  isAuthenticated(): boolean;
  getCurrentToken(): string | null;
  getCurrentUser(): any | null;
}

export interface UserService extends BaseService {
  getProfile(): Promise<ApiResponse<UserProfile>>;
  updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>>;
  changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>>;
  deleteAccount(): Promise<ApiResponse<void>>;
}

export interface ProjectService extends BaseService {
  getProjects(params?: PaginationParams): Promise<PaginatedResponse<Project>>;
  getProject(id: string): Promise<ApiResponse<Project>>;
  createProject(data: CreateProjectData): Promise<ApiResponse<Project>>;
  updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<ApiResponse<Project>>;
  deleteProject(id: string): Promise<ApiResponse<void>>;
}

export interface TimetableService extends BaseService {
  getTimetable(): Promise<ApiResponse<Timetable>>;
  updateTimetable(data: Partial<Timetable>): Promise<ApiResponse<Timetable>>;
  addEvent(event: TimetableEvent): Promise<ApiResponse<TimetableEvent>>;
  updateEvent(
    id: string,
    event: Partial<TimetableEvent>
  ): Promise<ApiResponse<TimetableEvent>>;
  deleteEvent(id: string): Promise<ApiResponse<void>>;
  getEventsByDay(dayOfWeek: number): Promise<ApiResponse<TimetableEvent[]>>;
  getEventsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<TimetableEvent[]>>;
}

// Data models
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface AuthProfile {
  userId: string;
  email: string;
  isGoogleUser: boolean;
  isNewUser: boolean;
}

export interface GoogleTokenRequest {
  idToken: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color: string;
}

export interface Timetable {
  id: string;
  userId: string;
  events: TimetableEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface TimetableEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  color: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

// Canvas Service Types
export interface CanvasService extends BaseService {
  setupCanvas(data: CanvasSetupData): Promise<ApiResponse<CanvasSetupResponse>>;
  linkCanvasData(): Promise<ApiResponse<CanvasLinkResponse>>;
}

export interface CanvasSetupData {
  canvas_institutional_url: string;
  canvas_token: string;
}

export interface CanvasUserDetails {
  id: number;
  name: string;
  created_at: string;
  sortable_name: string;
  short_name: string;
  avatar_url: string;
  last_name: string;
  first_name: string;
  locale: string | null;
  effective_locale: string;
  permissions: {
    can_update_name: boolean;
    can_update_avatar: boolean;
    limit_parent_app_web_access: boolean;
  };
}

export interface CanvasSetupResponse {
  message: string;
  user_details: CanvasUserDetails;
}

export interface CanvasLinkResponse {
  message: string;
}

// Main Service Types
export interface MainService extends BaseService {
  getAllUserData(): Promise<ApiResponse<AllUserData>>;
  getCachedData(): Promise<CachedData | null>;
  clearCachedData(): Promise<void>;
  getCacheAge(): Promise<number | null>;
  getDB(): any; // Returns IndexedDB service for direct CRUD operations
}

// All User Data - contains projects, tasks, and todos
export interface AllUserData {
  projects?: any[];
  tasks?: any[];
  todos?: any[];
  [key: string]: any; // Allow for additional fields
}

// Cached Data with timestamp
export interface CachedData {
  data: AllUserData;
  lastUpdated: string; // ISO 8601 datetime string
}
