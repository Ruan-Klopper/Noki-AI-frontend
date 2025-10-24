/**
 * Utility to populate IndexedDB with test data for development
 * Run this in your browser console to add sample tasks and todos
 */

import { getIndexedDBService } from "./indexeddb.service";

export async function populateTestData() {
  const db = getIndexedDBService();
  await db.init();

  console.log("[Test Data] Starting to populate database...");

  const userId = "test-user-123";

  // Create test projects
  const projects = [
    {
      id: "proj-1",
      name: "Interactive Development 300",
      description: "Mobile app development course",
      color: "bg-noki-primary",
      user_id: userId,
      source: "manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "proj-2",
      name: "Photography 300",
      description: "Commercial photography course",
      color: "bg-noki-tertiary",
      user_id: userId,
      source: "manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "proj-3",
      name: "Visual Culture 300",
      description: "Art history and theory",
      color: "bg-orange-400",
      user_id: userId,
      source: "manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "proj-4",
      name: "Personal",
      description: "Personal tasks and goals",
      color: "bg-purple-400",
      user_id: userId,
      source: "manual",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Helper to get date string (always from today)
  const getDateString = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dateStr = date.toISOString().split("T")[0];
    console.log(`[Test Data] Date for offset ${daysOffset}:`, dateStr);
    return dateStr;
  };

  // Helper to get date+time string
  const getDateTimeString = (
    daysOffset: number,
    hour: number,
    minute: number = 0
  ) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setUTCHours(hour, minute, 0, 0);
    const dateTimeStr = date.toISOString();
    console.log(
      `[Test Data] DateTime for offset ${daysOffset} at ${hour}:${minute
        .toString()
        .padStart(2, "0")}:`,
      dateTimeStr
    );
    return dateTimeStr;
  };

  // Create test tasks
  const tasks = [
    {
      id: "task-1",
      title: "40 images for commercial portfolio",
      description: "Capture and edit 40 professional photos",
      project_id: "proj-2",
      user_id: userId,
      due_date: getDateTimeString(0, 14, 0), // Today at 2:00 PM (14:00 UTC)
      is_all_day: false,
      start_time: null,
      end_time: null,
      priority: "high",
      is_submitted: false,
      status: "Not Started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-2",
      title: "Start planning mobile app",
      description: "Initial planning and wireframes",
      project_id: "proj-1",
      user_id: userId,
      due_date: getDateTimeString(1, 15, 0), // Tomorrow at 3:00 PM (15:00 UTC)
      is_all_day: false,
      start_time: null,
      end_time: null,
      priority: "high",
      is_submitted: false,
      status: "In Progress",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-3",
      title: "Research Methods Essay",
      description: "Write 2000 word essay on research methodologies",
      project_id: "proj-3",
      user_id: userId,
      due_date: getDateString(5) + "T00:00:00.000Z",
      is_all_day: true,
      start_time: null,
      end_time: null,
      priority: "medium",
      is_submitted: false,
      status: "Not Started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-4",
      title: "Weekly Project Review",
      description: "Review progress on all projects",
      project_id: "proj-4",
      user_id: userId,
      due_date: getDateTimeString(2, 9, 30), // In 2 days at 9:30 AM (09:30 UTC)
      is_all_day: false,
      start_time: null,
      end_time: null,
      priority: "low",
      is_submitted: true,
      status: "Completed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-5",
      title: "Portfolio Presentation",
      description: "Present final portfolio to class",
      project_id: "proj-2",
      user_id: userId,
      due_date: getDateTimeString(6, 14, 0), // In 6 days at 2:00 PM (14:00 UTC)
      is_all_day: false,
      start_time: null,
      end_time: null,
      priority: "high",
      is_submitted: false,
      status: "Not Started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-6",
      title: "Code review session",
      description: "Review code with team members",
      project_id: "proj-1",
      user_id: userId,
      due_date: getDateString(0), // Today
      start_time: "09:30",
      end_time: "10:30",
      priority: "medium",
      is_submitted: false,
      status: "Not Started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-7",
      title: "Edit photo series",
      description: "Post-processing for photo series",
      project_id: "proj-2",
      user_id: userId,
      due_date: getDateString(3),
      start_time: "09:00",
      end_time: "11:00",
      priority: "medium",
      is_submitted: false,
      status: "In Progress",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-8",
      title: "Database design document",
      description: "Create database schema documentation",
      project_id: "proj-1",
      user_id: userId,
      due_date: getDateString(4),
      start_time: null,
      end_time: null,
      priority: "high",
      is_submitted: false,
      status: "Not Started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-9",
      title: "UI mockups",
      description: "Create high-fidelity mockups in Figma",
      project_id: "proj-1",
      user_id: userId,
      due_date: getDateString(0), // Today
      start_time: "10:15",
      end_time: "11:30",
      priority: "medium",
      is_submitted: false,
      status: "In Progress",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Create test todos
  const todos = [
    {
      id: "todo-1",
      title: "Review lecture notes",
      description: "Go through week 8 lecture notes",
      task_id: "task-2",
      user_id: userId,
      due_date: getDateString(0), // Today
      start_time: null,
      end_time: null,
      priority: "medium",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "todo-2",
      title: "Buy camera equipment",
      description: "Purchase new lens and filters",
      task_id: "task-1",
      user_id: userId,
      due_date: getDateString(1),
      start_time: "11:00",
      end_time: "12:00",
      priority: "high",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "todo-3",
      title: "Read chapter 5",
      description: "Visual Culture textbook chapter 5",
      task_id: "task-3",
      user_id: userId,
      due_date: getDateString(2),
      start_time: null,
      end_time: null,
      priority: "medium",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "todo-4",
      title: "Team meeting prep",
      description: "Prepare agenda for team meeting",
      task_id: "task-6",
      user_id: userId,
      due_date: getDateString(3),
      start_time: "16:00",
      end_time: "17:00",
      priority: "low",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "todo-5",
      title: "Update portfolio website",
      description: "Add recent projects to portfolio",
      task_id: "task-5",
      user_id: userId,
      due_date: getDateString(0), // Today
      start_time: "14:00",
      end_time: "15:00",
      priority: "medium",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "todo-6",
      title: "Practice photography techniques",
      description: "Practice lighting and composition",
      task_id: "task-1",
      user_id: userId,
      due_date: getDateString(4),
      start_time: null,
      end_time: null,
      priority: "low",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "todo-7",
      title: "Email professor",
      description: "Ask about assignment extension",
      task_id: "task-3",
      user_id: userId,
      due_date: getDateString(0), // Today
      start_time: "10:00",
      end_time: "10:30",
      priority: "high",
      is_submitted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  console.log("[Test Data] Preparing to store data...");
  console.log("[Test Data] Data to be stored:", {
    projectsCount: projects.length,
    tasksCount: tasks.length,
    todosCount: todos.length,
  });

  // Log sample data being sent
  console.log("[Test Data] Sample project being sent:", projects[0]);
  console.log("[Test Data] Sample task being sent:", tasks[0]);
  console.log("[Test Data] Sample todo being sent:", todos[0]);

  // Save all data using the flattened structure
  await db.storeAllData({
    projects,
    tasks,
    todos,
  });

  console.log("[Test Data] ✅ Successfully populated database!");
  console.log(`[Test Data] Added:`);
  console.log(`  - ${projects.length} projects`);
  console.log(`  - ${tasks.length} tasks`);
  console.log(`  - ${todos.length} todos`);

  // Verify what was actually stored
  console.log("[Test Data] Verifying stored data...");
  const storedProjects = await db.getProjects();
  const storedTasks = await db.getTasks();
  const storedTodos = await db.getTodos();

  console.log("[Test Data] Verification results:", {
    storedProjectsCount: storedProjects.length,
    storedTasksCount: storedTasks.length,
    storedTodosCount: storedTodos.length,
  });

  if (storedProjects.length > 0) {
    console.log("[Test Data] Sample stored project:", storedProjects[0]);
  }
  if (storedTasks.length > 0) {
    console.log("[Test Data] Sample stored task:", storedTasks[0]);
  }
  if (storedTodos.length > 0) {
    console.log("[Test Data] Sample stored todo:", storedTodos[0]);
  }

  return {
    projects,
    tasks,
    todos,
  };
}

// Helper to clear all test data
export async function clearTestData() {
  const db = getIndexedDBService();
  await db.init();
  await db.clearAll();
  console.log("[Test Data] ✅ Database cleared!");
}

// If you want to auto-populate on import (for testing)
// Uncomment the line below:
// populateTestData();
