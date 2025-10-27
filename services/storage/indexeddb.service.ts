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
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      console.warn(
        "[IndexedDB] Not in browser environment, skipping initialization"
      );
      return Promise.resolve();
    }

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

    console.log("[IndexedDB] storeAllData called with:", {
      projectsCount: data.projects?.length || 0,
      tasksCount: data.tasks?.length || 0,
      todosCount: data.todos?.length || 0,
    });

    // Log first item of each type to see structure
    if (data.projects && data.projects.length > 0) {
      console.log("[IndexedDB] Sample project:", data.projects[0]);
    }
    if (data.tasks && data.tasks.length > 0) {
      console.log("[IndexedDB] Sample task:", data.tasks[0]);
    }
    if (data.todos && data.todos.length > 0) {
      console.log("[IndexedDB] Sample todo:", data.todos[0]);
    }

    const transaction = db.transaction(
      ["projects", "tasks", "todos", "metadata"],
      "readwrite"
    );

    let projectsStored = 0;
    let tasksStored = 0;
    let todosStored = 0;

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("[IndexedDB] ✅ Transaction completed successfully");
        console.log("[IndexedDB] Stored counts:", {
          projects: projectsStored,
          tasks: tasksStored,
          todos: todosStored,
        });
        resolve();
      };

      transaction.onerror = () => {
        console.error("[IndexedDB] ❌ Transaction failed:", transaction.error);
        reject(transaction.error);
      };

      // Clear existing data and store new data
      const projectsStore = transaction.objectStore("projects");
      const tasksStore = transaction.objectStore("tasks");
      const todosStore = transaction.objectStore("todos");
      const metadataStore = transaction.objectStore("metadata");

      // Clear stores
      console.log("[IndexedDB] Clearing existing data...");
      projectsStore.clear();
      tasksStore.clear();
      todosStore.clear();

      // Store projects and flatten nested tasks/todos
      if (data.projects) {
        console.log("[IndexedDB] Processing projects (nested structure)...");
        data.projects.forEach((project, index) => {
          // Extract tasks before storing project
          const tasks = project.tasks || [];

          // Store project without nested tasks
          const { tasks: _, ...projectWithoutTasks } = project;

          try {
            projectsStore.add(projectWithoutTasks);
            projectsStored++;
            console.log(
              `[IndexedDB] ✓ Stored project ${index + 1}: ${
                project.name || project.id
              }`
            );
          } catch (error) {
            console.error(
              `[IndexedDB] ✗ Failed to store project ${index + 1}:`,
              error
            );
          }

          // Store tasks and flatten nested todos
          tasks.forEach((task: any, taskIndex: number) => {
            const todos = task.todos || [];

            // Store task without nested todos
            const { todos: __, ...taskWithoutTodos } = task;

            try {
              tasksStore.add(taskWithoutTodos);
              tasksStored++;
              console.log(
                `[IndexedDB] ✓ Stored task ${taskIndex + 1} for project ${
                  project.name || project.id
                }`
              );
            } catch (error) {
              console.error(
                `[IndexedDB] ✗ Failed to store task ${taskIndex + 1}:`,
                error
              );
            }

            // Store todos
            todos.forEach((todo: any, todoIndex: number) => {
              try {
                todosStore.add(todo);
                todosStored++;
                console.log(
                  `[IndexedDB] ✓ Stored todo ${todoIndex + 1} for task ${
                    task.id
                  }`
                );
              } catch (error) {
                console.error(
                  `[IndexedDB] ✗ Failed to store todo ${todoIndex + 1}:`,
                  error
                );
              }
            });
          });
        });
      }

      // Handle flat arrays if provided (for backwards compatibility)
      if (data.tasks && Array.isArray(data.tasks)) {
        console.log("[IndexedDB] Processing tasks (flat array)...");
        data.tasks.forEach((task, index) => {
          const { todos: _, ...taskWithoutTodos } = task;

          try {
            tasksStore.add(taskWithoutTodos);
            tasksStored++;
            console.log(
              `[IndexedDB] ✓ Stored flat task ${index + 1}: ${
                task.title || task.id
              }`
            );
          } catch (error) {
            console.error(
              `[IndexedDB] ✗ Failed to store flat task ${index + 1}:`,
              error,
              task
            );
          }
        });
      }

      if (data.todos && Array.isArray(data.todos)) {
        console.log("[IndexedDB] Processing todos (flat array)...");
        data.todos.forEach((todo, index) => {
          try {
            todosStore.add(todo);
            todosStored++;
            console.log(
              `[IndexedDB] ✓ Stored flat todo ${index + 1}: ${
                todo.title || todo.id
              }`
            );
          } catch (error) {
            console.error(
              `[IndexedDB] ✗ Failed to store flat todo ${index + 1}:`,
              error,
              todo
            );
          }
        });
      }

      // Store metadata
      metadataStore.put({
        key: "lastUpdated",
        value: new Date().toISOString(),
      });
      console.log("[IndexedDB] Metadata updated");
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

    console.log("[IndexedDB] Fetching all data from database...");

    const projects = await this.getAll(transaction.objectStore("projects"));
    const tasks = await this.getAll(transaction.objectStore("tasks"));
    const todos = await this.getAll(transaction.objectStore("todos"));
    const metadata = await this.get(
      transaction.objectStore("metadata"),
      "lastUpdated"
    );

    console.log("[IndexedDB] Retrieved from database:", {
      projectsCount: projects.length,
      tasksCount: tasks.length,
      todosCount: todos.length,
      lastUpdated: metadata?.value || null,
    });

    // Log sample data to verify structure
    if (projects.length > 0) {
      console.log("[IndexedDB] Sample retrieved project:", projects[0]);
    }
    if (tasks.length > 0) {
      console.log("[IndexedDB] Sample retrieved task:", tasks[0]);
    }
    if (todos.length > 0) {
      console.log("[IndexedDB] Sample retrieved todo:", todos[0]);
    }

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
    const projects = await this.getAll(store);
    console.log(
      `[IndexedDB] getProjects() returned ${projects.length} projects`
    );
    return projects;
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
    const tasks = await this.getAll(store);
    console.log(`[IndexedDB] getTasks() returned ${tasks.length} tasks`);
    return tasks;
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
    const todos = await this.getAll(store);
    console.log(`[IndexedDB] getTodos() returned ${todos.length} todos`);
    return todos;
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
   * =====================================================
   * FAST RETRIEVAL FUNCTIONS FOR PROJECTS
   * =====================================================
   */

  /**
   * Get a single project by ID
   */
  async getProjectById(projectId: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readonly");
    const store = transaction.objectStore("projects");

    return new Promise((resolve, reject) => {
      const request = store.get(projectId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get projects by user ID
   */
  async getProjectsByUser(userId: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readonly");
    const store = transaction.objectStore("projects");
    const index = store.index("user_id");

    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get projects by source (e.g., "canvas", "manual")
   */
  async getProjectsBySource(source: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readonly");
    const store = transaction.objectStore("projects");
    const index = store.index("source");

    return new Promise((resolve, reject) => {
      const request = index.getAll(source);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get projects sorted by creation date
   */
  async getProjectsSortedByDate(ascending: boolean = false): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["projects"], "readonly");
    const store = transaction.objectStore("projects");
    const index = store.index("created_at");

    return new Promise((resolve, reject) => {
      const request = ascending
        ? index.openCursor()
        : index.openCursor(null, "prev");
      const results: any[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get project with all its tasks (includes nested todos)
   */
  async getProjectWithTasks(projectId: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["projects", "tasks", "todos"],
      "readonly"
    );

    const project = await this.get(
      transaction.objectStore("projects"),
      projectId
    );

    if (!project) return null;

    // Get tasks for this project
    const tasks = await this.getTasksByProject(projectId);

    // Add todos to each task
    const tasksWithTodos = await Promise.all(
      tasks.map(async (task) => {
        const todos = await this.getTodosByTask(task.id);
        return { ...task, todos };
      })
    );

    return {
      ...project,
      tasks: tasksWithTodos,
    };
  }

  /**
   * =====================================================
   * FAST RETRIEVAL FUNCTIONS FOR TASKS
   * =====================================================
   */

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
      const request = store.get(taskId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tasks by user ID
   */
  async getTasksByUser(userId: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const index = store.index("user_id");

    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tasks by priority
   */
  async getTasksByPriority(priority: string | number): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const index = store.index("priority");

    return new Promise((resolve, reject) => {
      const request = index.getAll(priority);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tasks by submission status
   */
  async getTasksBySubmissionStatus(isSubmitted: boolean): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const index = store.index("is_submitted");

    return new Promise((resolve, reject) => {
      const request = index.getAll(isSubmitted ? 1 : 0);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tasks due within a date range
   */
  async getTasksByDateRange(
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const index = store.index("due_date");

    return new Promise((resolve, reject) => {
      const range = IDBKeyRange.bound(startDate, endDate);
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get tasks due today
   */
  async getTasksDueToday(): Promise<any[]> {
    const today = new Date().toISOString().split("T")[0];
    return this.getTasksByDateRange(today, today);
  }

  /**
   * Get tasks due this week
   */
  async getTasksDueThisWeek(): Promise<any[]> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return this.getTasksByDateRange(
      startOfWeek.toISOString().split("T")[0],
      endOfWeek.toISOString().split("T")[0]
    );
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<any[]> {
    const today = new Date().toISOString().split("T")[0];
    const db = await this.ensureDB();
    const transaction = db.transaction(["tasks"], "readonly");
    const store = transaction.objectStore("tasks");
    const index = store.index("due_date");

    return new Promise((resolve, reject) => {
      const range = IDBKeyRange.upperBound(today, true);
      const request = index.openCursor(range);
      const results: any[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          // Only include tasks that are not submitted
          if (!cursor.value.is_submitted) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get task with all its todos
   */
  async getTaskWithTodos(taskId: string): Promise<any | null> {
    const task = await this.getTaskById(taskId);
    if (!task) return null;

    const todos = await this.getTodosByTask(taskId);
    return {
      ...task,
      todos,
    };
  }

  /**
   * Get tasks for a project with their todos
   */
  async getTasksWithTodosByProject(projectId: string): Promise<any[]> {
    const tasks = await this.getTasksByProject(projectId);

    return Promise.all(
      tasks.map(async (task) => {
        const todos = await this.getTodosByTask(task.id);
        return { ...task, todos };
      })
    );
  }

  /**
   * =====================================================
   * FAST RETRIEVAL FUNCTIONS FOR TODOS
   * =====================================================
   */

  /**
   * Get a single todo by ID
   */
  async getTodoById(todoId: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");

    return new Promise((resolve, reject) => {
      const request = store.get(todoId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get todos by user ID
   */
  async getTodosByUser(userId: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const index = store.index("user_id");

    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get todos by priority
   */
  async getTodosByPriority(priority: string | number): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const index = store.index("priority");

    return new Promise((resolve, reject) => {
      const request = index.getAll(priority);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get todos by completion status
   */
  async getTodosBySubmissionStatus(isSubmitted: boolean): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["todos"], "readonly");
    const store = transaction.objectStore("todos");
    const index = store.index("is_submitted");

    return new Promise((resolve, reject) => {
      const request = index.getAll(isSubmitted ? 1 : 0);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get incomplete todos
   */
  async getIncompleteTodos(): Promise<any[]> {
    return this.getTodosBySubmissionStatus(false);
  }

  /**
   * Get completed todos
   */
  async getCompletedTodos(): Promise<any[]> {
    return this.getTodosBySubmissionStatus(true);
  }

  /**
   * =====================================================
   * ADVANCED QUERY FUNCTIONS
   * =====================================================
   */

  /**
   * Get dashboard summary data
   */
  async getDashboardSummary(): Promise<{
    totalProjects: number;
    totalTasks: number;
    totalTodos: number;
    completedTasks: number;
    completedTodos: number;
    overdueTasks: number;
    tasksDueToday: number;
    tasksDueThisWeek: number;
  }> {
    const [
      projects,
      tasks,
      todos,
      completedTasks,
      completedTodos,
      overdueTasks,
      tasksDueToday,
      tasksDueThisWeek,
    ] = await Promise.all([
      this.getProjects(),
      this.getTasks(),
      this.getTodos(),
      this.getTasksBySubmissionStatus(true),
      this.getTodosBySubmissionStatus(true),
      this.getOverdueTasks(),
      this.getTasksDueToday(),
      this.getTasksDueThisWeek(),
    ]);

    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalTodos: todos.length,
      completedTasks: completedTasks.length,
      completedTodos: completedTodos.length,
      overdueTasks: overdueTasks.length,
      tasksDueToday: tasksDueToday.length,
      tasksDueThisWeek: tasksDueThisWeek.length,
    };
  }

  /**
   * Search projects by name (case-insensitive partial match)
   */
  async searchProjectsByName(query: string): Promise<any[]> {
    const projects = await this.getProjects();
    const lowerQuery = query.toLowerCase();
    return projects.filter((project) =>
      project.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search tasks by title (case-insensitive partial match)
   */
  async searchTasksByTitle(query: string): Promise<any[]> {
    const tasks = await this.getTasks();
    const lowerQuery = query.toLowerCase();
    return tasks.filter(
      (task) => task.title && task.title.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search todos by title (case-insensitive partial match)
   */
  async searchTodosByTitle(query: string): Promise<any[]> {
    const todos = await this.getTodos();
    const lowerQuery = query.toLowerCase();
    return todos.filter(
      (todo) => todo.title && todo.title.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get tasks grouped by project
   */
  async getTasksGroupedByProject(): Promise<
    Record<string, { project: any; tasks: any[] }>
  > {
    const projects = await this.getProjects();
    const grouped: Record<string, { project: any; tasks: any[] }> = {};

    for (const project of projects) {
      const tasks = await this.getTasksByProject(project.id);
      grouped[project.id] = {
        project,
        tasks,
      };
    }

    return grouped;
  }

  /**
   * Get upcoming tasks (next 7 days)
   */
  async getUpcomingTasks(days: number = 7): Promise<any[]> {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    return this.getTasksByDateRange(
      today.toISOString().split("T")[0],
      futureDate.toISOString().split("T")[0]
    );
  }

  /**
   * Get tasks by multiple filters
   */
  async getTasksFiltered(filters: {
    projectId?: string;
    priority?: string | number;
    isSubmitted?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    let tasks = await this.getTasks();

    // Apply filters
    if (filters.projectId) {
      tasks = tasks.filter((task) => task.project_id === filters.projectId);
    }

    if (filters.priority !== undefined) {
      tasks = tasks.filter((task) => task.priority === filters.priority);
    }

    if (filters.isSubmitted !== undefined) {
      tasks = tasks.filter((task) => task.is_submitted === filters.isSubmitted);
    }

    if (filters.startDate && filters.endDate) {
      const startDate = filters.startDate;
      const endDate = filters.endDate;
      tasks = tasks.filter(
        (task) => task.due_date >= startDate && task.due_date <= endDate
      );
    }

    return tasks;
  }

  /**
   * Get todos by multiple filters
   */
  async getTodosFiltered(filters: {
    taskId?: string;
    priority?: string | number;
    isSubmitted?: boolean;
  }): Promise<any[]> {
    let todos = await this.getTodos();

    // Apply filters
    if (filters.taskId) {
      todos = todos.filter((todo) => todo.task_id === filters.taskId);
    }

    if (filters.priority !== undefined) {
      todos = todos.filter((todo) => todo.priority === filters.priority);
    }

    if (filters.isSubmitted !== undefined) {
      todos = todos.filter((todo) => todo.is_submitted === filters.isSubmitted);
    }

    return todos;
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
