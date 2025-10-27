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

    console.log(`[HTTP Client] Full URL: ${fullUrl}`);
    console.log(`[HTTP Client] Method: ${options.method}`);
    console.log(`[HTTP Client] Headers:`, defaultHeaders);

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      // Create AbortController for timeout (fresh for each attempt)
      const controller = new AbortController();
      const timeoutMs = this.config.timeout;

      console.log(
        `[HTTP Client] Making ${options.method} request to ${fullUrl} with timeout: ${timeoutMs}ms`
      );

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
        console.log(`[HTTP Client] Fetching: ${fullUrl}`);
        const response = await fetch(fullUrl, requestOptions);
        clearTimeout(timeoutId);

        console.log(`[HTTP Client] Response received from ${fullUrl}:`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        if (fullUrl.includes("/canvas/")) {
          console.log(
            `[HTTP Client] Request to ${fullUrl} completed successfully`
          );
        }

        const result = (await handleApiResponse(response)) as ApiResponse<T>;
        console.log(`[HTTP Client] Parsed response:`, result);
        return result;
      } catch (error) {
        clearTimeout(timeoutId);

        console.error(`[HTTP Client] ERROR in request to ${fullUrl}:`, {
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });

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
    console.log(`[HTTP Client] POST request to: ${url}`, { data });
    const result = await this.makeRequest<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
    console.log(`[HTTP Client] POST response from: ${url}`, result);
    return result;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`[HTTP Client] PUT request to: ${url}`, { data });
    const result = await this.makeRequest<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
    console.log(`[HTTP Client] PUT response from: ${url}`, result);
    return result;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`[HTTP Client] DELETE request to: ${url}`, { data });
    const result = await this.makeRequest<T>(url, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
    console.log(`[HTTP Client] DELETE response from: ${url}`, result);
    return result;
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
