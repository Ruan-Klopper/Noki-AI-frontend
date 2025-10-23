/**
 * IndexedDB Service for storing user data
 *
 * Manages structured storage for:
 * - Projects
 * - Tasks
 * - Todos
 *
 * Provides CRUD operations with indexing and querying capabilities
 */

export interface DBSchema {
  projects: any[];
  tasks: any[];
  todos: any[];
  metadata: {
    lastUpdated: string;
    version: number;
  };
}

export class IndexedDBService {
  private dbName = "NokiDB";
  private version = 1;
  private db: IDBDatabase | null = null;

  /**
   * Initialize and open the database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("[IndexedDB] Failed to open database:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("[IndexedDB] Database opened successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log("[IndexedDB] Upgrading database schema...");

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains("projects")) {
          const projectStore = db.createObjectStore("projects", {
            keyPath: "id",
          });
          projectStore.createIndex("user_id", "user_id", { unique: false });
          projectStore.createIndex("created_at", "created_at", {
            unique: false,
          });
          projectStore.createIndex("source", "source", { unique: false });
          console.log("[IndexedDB] Created projects store");
        }

        if (!db.objectStoreNames.contains("tasks")) {
          const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
          taskStore.createIndex("project_id", "project_id", { unique: false });
          taskStore.createIndex("user_id", "user_id", { unique: false });
          taskStore.createIndex("priority", "priority", { unique: false });
          taskStore.createIndex("due_date", "due_date", { unique: false });
          taskStore.createIndex("is_submitted", "is_submitted", {
            unique: false,
          });
          console.log("[IndexedDB] Created tasks store");
        }

        if (!db.objectStoreNames.contains("todos")) {
          const todoStore = db.createObjectStore("todos", { keyPath: "id" });
          todoStore.createIndex("task_id", "task_id", { unique: false });
          todoStore.createIndex("user_id", "user_id", { unique: false });
          todoStore.createIndex("priority", "priority", { unique: false });
          todoStore.createIndex("is_submitted", "is_submitted", {
            unique: false,
          });
          console.log("[IndexedDB] Created todos store");
        }

        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata", { keyPath: "key" });
          console.log("[IndexedDB] Created metadata store");
        }
      };
    });
  }

  /**
   * Ensures database is initialized
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error("Failed to initialize database");
    }
    return this.db;
  }

  /**
   * Store all user data at once
   * Handles nested structure from backend (projects > tasks > todos)
   * Flattens the data for efficient storage and querying
   */
  async storeAllData(data: {
    projects?: any[];
    tasks?: any[];
    todos?: any[];
  }): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["projects", "tasks", "todos", "metadata"],
      "readwrite"
    );

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("[IndexedDB] All data stored successfully");
        resolve();
      };

      transaction.onerror = () => {
        console.error("[IndexedDB] Transaction failed:", transaction.error);
        reject(transaction.error);
      };

      // Clear existing data and store new data
      const projectsStore = transaction.objectStore("projects");
      const tasksStore = transaction.objectStore("tasks");
      const todosStore = transaction.objectStore("todos");
      const metadataStore = transaction.objectStore("metadata");

      // Clear stores
      projectsStore.clear();
      tasksStore.clear();
      todosStore.clear();

      // Store projects and flatten nested tasks/todos
      if (data.projects) {
        data.projects.forEach((project) => {
          // Extract tasks before storing project
          const tasks = project.tasks || [];

          // Store project without nested tasks
          const { tasks: _, ...projectWithoutTasks } = project;
          projectsStore.add(projectWithoutTasks);

          // Store tasks and flatten nested todos
          tasks.forEach((task: any) => {
            const todos = task.todos || [];

            // Store task without nested todos
            const { todos: __, ...taskWithoutTodos } = task;
            tasksStore.add(taskWithoutTodos);

            // Store todos
            todos.forEach((todo: any) => {
              todosStore.add(todo);
            });
          });
        });
      }

      // Handle flat arrays if provided (for backwards compatibility)
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks.forEach((task) => {
          const { todos: _, ...taskWithoutTodos } = task;
          tasksStore.add(taskWithoutTodos);
        });
      }

      if (data.todos && Array.isArray(data.todos)) {
        data.todos.forEach((todo) => {
          todosStore.add(todo);
        });
      }

      // Store metadata
      metadataStore.put({
        key: "lastUpdated",
        value: new Date().toISOString(),
      });
    });
  }

  /**
   * Get all data from database (flat structure)
   */
  async getAllData(): Promise<{
    projects: any[];
    tasks: any[];
    todos: any[];
    lastUpdated: string | null;
  }> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["projects", "tasks", "todos", "metadata"],
      "readonly"
    );

    const projects = await this.getAll(transaction.objectStore("projects"));
    const tasks = await this.getAll(transaction.objectStore("tasks"));
    const todos = await this.getAll(transaction.objectStore("todos"));
    const metadata = await this.get(
      transaction.objectStore("metadata"),
      "lastUpdated"
    );

    return {
      projects,
      tasks,
      todos,
      lastUpdated: metadata?.value || null,
    };
  }

  /**
   * Get all data with nested structure (projects > tasks > todos)
   * Reconstructs the hierarchy as received from backend
   */
  async getAllDataNested(): Promise<{
    projects: any[];
    lastUpdated: string | null;
  }> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["projects", "tasks", "todos", "metadata"],
      "readonly"
    );

    const projects = await this.getAll(transaction.objectStore("projects"));
    const tasks = await this.getAll(transaction.objectStore("tasks"));
    const todos = await this.getAll(transaction.objectStore("todos"));
    const metadata = await this.get(
      transaction.objectStore("metadata"),
      "lastUpdated"
    );

    // Build nested structure
    const projectsWithTasks = projects.map((project) => {
      // Find tasks for this project
      const projectTasks = tasks.filter(
        (task) => task.project_id === project.id
      );

      // Add todos to each task
      const tasksWithTodos = projectTasks.map((task) => {
        const taskTodos = todos.filter((todo) => todo.task_id === task.id);
        return {
          ...task,
          todos: taskTodos,
        };
      });

      return {
        ...project,
        tasks: tasksWithTodos,
      };
    });

    return {
      projects: projectsWithTasks,
      lastUpdated: metadata?.value || null,
    };
  }

  /**
   * Get all records from an object store
   */
  private getAll(store: IDBObjectStore): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a single record from an object store
   */
  private get(store: IDBObjectStore, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add or update a project
   */
  async saveProject(project: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readwrite");
    const store = transaction.objectStore("projects");

    return new Promise((resolve, reject) => {
      const request = store.put(project);
      request.onsuccess = () => {
        console.log("[IndexedDB] Project saved:", project.id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readwrite");
    const store = transaction.objectStore("projects");

    return new Promise((resolve, reject) => {
      const request = store.delete(projectId);
      request.onsuccess = () => {
        console.log("[IndexedDB] Project deleted:", projectId);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readonly");
    const store = transaction.objectStore("projects");
    return this.getAll(store);
  }

  /**
   * Add or update a task
   */
  async saveTask(task: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readwrite");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
      const request = store.put(task);
      request.onsuccess = () => {
        console.log("[IndexedDB] Task saved:", task.id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readwrite");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
      const request = store.delete(taskId);
      request.onsuccess = () => {
        console.log("[IndexedDB] Task deleted:", taskId);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    return this.getAll(store);
  }

  /**
   * Get tasks by project ID
   */
  async getTasksByProject(projectId: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const index = store.index("project_id");

    return new Promise((resolve, reject) => {
      const request = index.getAll(projectId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add or update a todo
   */
  async saveTodo(todo: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readwrite");
    const store = transaction.objectStore("todos");

    return new Promise((resolve, reject) => {
      const request = store.put(todo);
      request.onsuccess = () => {
        console.log("[IndexedDB] Todo saved:", todo.id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a todo
   */
  async deleteTodo(todoId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readwrite");
    const store = transaction.objectStore("todos");

    return new Promise((resolve, reject) => {
      const request = store.delete(todoId);
      request.onsuccess = () => {
        console.log("[IndexedDB] Todo deleted:", todoId);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all todos
   */
  async getTodos(): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    return this.getAll(store);
  }

  /**
   * Get todos by task ID
   */
  async getTodosByTask(taskId: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const index = store.index("task_id");

    return new Promise((resolve, reject) => {
      const request = index.getAll(taskId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data from database
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["projects", "tasks", "todos", "metadata"],
      "readwrite"
    );

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("[IndexedDB] All data cleared");
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);

      transaction.objectStore("projects").clear();
      transaction.objectStore("tasks").clear();
      transaction.objectStore("todos").clear();
      transaction.objectStore("metadata").clear();
    });
  }

  /**
   * Get cache age in milliseconds
   */
  async getCacheAge(): Promise<number | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["metadata"], "readonly");
    const metadata = await this.get(
      transaction.objectStore("metadata"),
      "lastUpdated"
    );

    if (metadata?.value) {
      const lastUpdated = new Date(metadata.value);
      const now = new Date();
      return now.getTime() - lastUpdated.getTime();
    }
    return null;
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log("[IndexedDB] Database connection closed");
    }
  }
}

// Singleton instance
let indexedDBInstance: IndexedDBService | null = null;

export const getIndexedDBService = (): IndexedDBService => {
  if (!indexedDBInstance) {
    indexedDBInstance = new IndexedDBService();
  }
  return indexedDBInstance;
};
