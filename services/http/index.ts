import { HttpService, ApiResponse, ApiConfig } from "../types";
import {
  getApiConfig,
  TokenManager,
  createAuthHeaders,
  handleApiResponse,
  withRetry,
  ApiException,
  DEBUG_MODE,
} from "../config";

// HTTP Client implementation following Single Responsibility Principle
export class HttpClient implements HttpService {
  private readonly config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = { ...getApiConfig(), ...config };

    // Only log in debug mode
    if (DEBUG_MODE && config?.timeout) {
      console.log(
        "[HTTP Client] Timeout:",
        this.config.timeout,
        "ms, Retries:",
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

    // Only log in debug mode
    if (DEBUG_MODE) {
      console.log(`[HTTP] ${options.method} ${fullUrl}`);
    }

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      // Create AbortController for timeout (fresh for each attempt)
      const controller = new AbortController();
      const timeoutMs = this.config.timeout;

      const timeoutId = setTimeout(() => {
        console.error(`[HTTP] Request timeout: ${fullUrl}`);
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

        // Only log errors or debug mode
        if (DEBUG_MODE && !response.ok) {
          console.error(`[HTTP] Error response:`, {
            url: fullUrl,
            status: response.status,
            statusText: response.statusText,
          });
        }

        const result = (await handleApiResponse(response)) as ApiResponse<T>;
        return result;
      } catch (error) {
        clearTimeout(timeoutId);

        // Always log errors (but more concisely)
        console.error(
          `[HTTP] Request failed: ${fullUrl}`,
          error instanceof Error ? error.message : String(error)
        );

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
    if (DEBUG_MODE) {
      console.log(
        `[HTTP] POST ${url}`,
        data ? `(${JSON.stringify(data).length} bytes)` : "(no body)"
      );
    }
    return this.makeRequest<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    if (DEBUG_MODE) {
      console.log(
        `[HTTP] PUT ${url}`,
        data ? `(${JSON.stringify(data).length} bytes)` : "(no body)"
      );
    }
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

  async delete<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    if (DEBUG_MODE) {
      console.log(`[HTTP] DELETE ${url}`);
    }
    return this.makeRequest<T>(url, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
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
