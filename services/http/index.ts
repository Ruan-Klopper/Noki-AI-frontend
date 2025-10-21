import { HttpService, ApiResponse, ApiConfig } from "../types";
import {
  getApiConfig,
  TokenManager,
  createAuthHeaders,
  handleApiResponse,
  withRetry,
  ApiException,
} from "../config";

// HTTP Client implementation following Single Responsibility Principle
export class HttpClient implements HttpService {
  private readonly config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = { ...getApiConfig(), ...config };
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith("http")
      ? url
      : `${this.config.baseUrl}${url}`;

    const defaultHeaders = {
      ...this.config.headers,
      ...createAuthHeaders(),
      ...options.headers,
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: defaultHeaders,
      signal: AbortSignal.timeout(this.config.timeout),
    };

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const response = await fetch(fullUrl, requestOptions);
      return handleApiResponse(response) as Promise<ApiResponse<T>>;
    };

    return withRetry(makeRequest, this.config.retries);
  }

  async get<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest<T>(fullUrl, {
      method: "GET",
    });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "DELETE",
    });
  }
}

// Singleton instance for global use
let httpClientInstance: HttpClient | null = null;

export const getHttpClient = (): HttpClient => {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient();
  }
  return httpClientInstance;
};

// Factory function for creating new instances
export const createHttpClient = (config?: Partial<ApiConfig>): HttpClient => {
  return new HttpClient(config);
};
