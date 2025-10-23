import { MainService, ApiResponse, AllUserData, CachedData } from "../types";
import { HttpClient, createHttpClient } from "../http";
import { getIndexedDBService } from "../storage/indexeddb.service";

/**
 * Main Service implementation
 *
 * This service handles fetching all user data including:
 * - Projects
 * - Tasks
 * - Todos
 *
 * The data is stored in IndexedDB for offline access and efficient CRUD operations.
 * Uses extended timeout (5 minutes) for fetching all user data.
 */
export class MainServiceImpl implements MainService {
  readonly baseUrl = "/misc";
  private httpClient: HttpClient;
  private db = getIndexedDBService();

  constructor(httpClient?: HttpClient) {
    // Create a custom HTTP client with extended timeout for fetching all user data
    const mainConfig = {
      timeout: 300000, // 5 minutes for fetching all user data
      retries: 0, // No retries to prevent duplicate fetches
    };

    this.httpClient = httpClient || createHttpClient(mainConfig);

    // Initialize IndexedDB
    this.db.init().catch((error) => {
      console.error("[Main Service] Failed to initialize IndexedDB:", error);
    });

    // Debug: Log the timeout configuration
    console.log(
      "[Main Service] Initialized with timeout:",
      mainConfig.timeout,
      "ms (",
      mainConfig.timeout / 60000,
      "minutes)"
    );
  }

  /**
   * Fetches all user data (projects, tasks, todos)
   * Stores the data in IndexedDB with timestamp
   * Requires bearer token authentication
   *
   * Backend returns nested structure: projects > tasks > todos
   * IndexedDB flattens it for efficient querying
   */
  async getAllUserData(): Promise<ApiResponse<AllUserData>> {
    try {
      const response = await this.httpClient.get<AllUserData>(
        `${this.baseUrl}/all-user-data`
      );

      if (response.success && response.data) {
        // Store in IndexedDB (it will flatten the nested structure)
        await this.db.storeAllData({
          projects: response.data.projects || [],
        });

        console.log("[Main Service] Data stored in IndexedDB successfully");
      }

      return response;
    } catch (error) {
      console.error("Error fetching all user data:", error);
      throw error;
    }
  }

  /**
   * Gets cached data from IndexedDB
   */
  async getCachedData(): Promise<CachedData | null> {
    try {
      const dbData = await this.db.getAllData();

      return {
        data: {
          projects: dbData.projects,
          tasks: dbData.tasks,
          todos: dbData.todos,
        },
        lastUpdated: dbData.lastUpdated || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error reading cached data:", error);
      return null;
    }
  }

  /**
   * Clears cached data from IndexedDB
   */
  async clearCachedData(): Promise<void> {
    try {
      await this.db.clearAll();
      console.log("[Main Service] IndexedDB cleared successfully");
    } catch (error) {
      console.error("Error clearing cached data:", error);
    }
  }

  /**
   * Checks if cached data exists and returns its age in milliseconds
   */
  async getCacheAge(): Promise<number | null> {
    try {
      return await this.db.getCacheAge();
    } catch (error) {
      console.error("Error getting cache age:", error);
      return null;
    }
  }

  /**
   * Get IndexedDB service for direct access to CRUD operations
   */
  getDB() {
    return this.db;
  }
}
