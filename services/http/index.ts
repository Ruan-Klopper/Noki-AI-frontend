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

    // Debug: Log HTTP client configuration
    if (config && config.timeout && config.timeout > 300000) {
      console.log(
        "[HTTP Client] Constructed with extended timeout:",
        this.config.timeout,
        "ms (",
        this.config.timeout / 300000,
        "minutes), retries:",
        this.config.retries
      );
    }
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

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      // Create AbortController for timeout (fresh for each attempt)
      const controller = new AbortController();
      const timeoutMs = this.config.timeout;

      // Debug log for Canvas endpoints
      if (fullUrl.includes("/canvas/")) {
        console.log(
          `[HTTP Client] Making request to ${fullUrl} with timeout: ${timeoutMs}ms (${
            timeoutMs / 300000
          } minutes)`
        );
      }

      const timeoutId = setTimeout(() => {
        console.error(
          `[HTTP Client] Request to ${fullUrl} timed out after ${timeoutMs}ms`
        );
        controller.abort();
      }, timeoutMs);

      const requestOptions: RequestInit = {
        ...options,
        headers: defaultHeaders,
        signal: controller.signal,
      };

      try {
        const response = await fetch(fullUrl, requestOptions);
        clearTimeout(timeoutId);

        if (fullUrl.includes("/canvas/")) {
          console.log(
            `[HTTP Client] Request to ${fullUrl} completed successfully`
          );
        }

        return handleApiResponse(response) as Promise<ApiResponse<T>>;
      } catch (error) {
        clearTimeout(timeoutId);

        if (fullUrl.includes("/canvas/")) {
          console.error(`[HTTP Client] Request to ${fullUrl} failed:`, error);
        }

        throw error;
      }
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
