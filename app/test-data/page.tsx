"use client";
import { useState } from "react";
import {
  populateTestData,
  clearTestData,
} from "@/services/storage/populate-test-data";

export default function TestDataPage() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePopulate = async () => {
    setIsLoading(true);
    setStatus("Populating database...");
    try {
      const result = await populateTestData();
      setStatus(
        `✅ Success! Added ${result.projects.length} projects, ${result.tasks.length} tasks, and ${result.todos.length} todos.`
      );
    } catch (error) {
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all data?")) return;

    setIsLoading(true);
    setStatus("Clearing database...");
    try {
      await clearTestData();
      setStatus("✅ Database cleared successfully!");
    } catch (error) {
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Test Data Manager
          </h1>
          <p className="text-muted-foreground">
            Populate or clear IndexedDB with test data for development
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePopulate}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-noki-primary hover:bg-noki-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-noki-primary/20"
          >
            {isLoading ? "Loading..." : "Populate Test Data"}
          </button>

          <button
            onClick={handleClear}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Clear All Data"}
          </button>
        </div>

        {status && (
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {status}
            </p>
          </div>
        )}

        <div className="mt-6 text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Test Data Includes:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              4 Projects (Interactive Dev, Photography, Visual Culture,
              Personal)
            </li>
            <li>9 Tasks with various due dates and priorities</li>
            <li>7 Todos linked to tasks</li>
          </ul>
          <p className="mt-4">
            After populating data, visit the{" "}
            <a href="/timetable" className="text-noki-primary hover:underline">
              Timetable page
            </a>{" "}
            to see it in action!
          </p>
        </div>
      </div>
    </div>
  );
}
