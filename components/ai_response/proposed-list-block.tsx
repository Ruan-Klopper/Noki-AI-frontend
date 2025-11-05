"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, ListTodo, Edit2, Check, X } from "lucide-react";
import { getIndexedDBService } from "@/services/storage/indexeddb.service";
import { useTodo } from "@/services/hooks/useTodo";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task, Project } from "@/services/types";

interface ProposedListItem {
  title: string;
  due_date: string;
  is_all_day: boolean;
}

interface ProposedListBlockProps {
  title: string;
  items: ProposedListItem[];
  proposed_list_for_task_id?: string;
}

interface EditableItem extends ProposedListItem {
  id: number;
  isEditing: boolean;
}

export function ProposedListBlock({
  title,
  items,
  proposed_list_for_task_id,
}: ProposedListBlockProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [editableItems, setEditableItems] = useState<EditableItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { createTodo } = useTodo();

  // Fetch task details from IndexedDB
  useEffect(() => {
    const fetchTask = async () => {
      if (!proposed_list_for_task_id) return;

      setTaskLoading(true);
      try {
        const db = getIndexedDBService();
        await db.init();
        const taskData = await db.getTaskById(proposed_list_for_task_id);
        setTask(taskData);

        // If task has project_id but no project object, fetch project separately
        if (taskData?.project_id && !taskData.project) {
          const projectData = await db.getProjectById(taskData.project_id);
          setProject(projectData);
        } else if (taskData?.project) {
          setProject(taskData.project);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setTaskLoading(false);
      }
    };

    fetchTask();
  }, [proposed_list_for_task_id]);

  // Initialize editable items from props
  useEffect(() => {
    if (items && items.length > 0) {
      setEditableItems(
        items.map((item, index) => ({
          ...item,
          id: index,
          isEditing: false,
        }))
      );
    }
  }, [items]);

  const formatDate = (dateString: string, isAllDay: boolean) => {
    const date = new Date(dateString);

    if (isAllDay) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return (
      date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const toggleEdit = (id: number) => {
    setEditableItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const updateItem = (
    id: number,
    updates: Partial<Omit<EditableItem, "id" | "isEditing">>
  ) => {
    setEditableItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDateChange = (id: number, date: Date | undefined) => {
    if (date) {
      updateItem(id, { due_date: date.toISOString() });
    }
  };

  const handleAllDayChange = (id: number, isAllDay: boolean) => {
    const item = editableItems.find((i) => i.id === id);
    if (item) {
      const newDate = new Date(item.due_date);
      if (isAllDay) {
        newDate.setHours(0, 0, 0, 0);
      }
      updateItem(id, {
        is_all_day: isAllDay,
        due_date: newDate.toISOString(),
      });
    }
  };

  const handleCreateTodos = async () => {
    if (!proposed_list_for_task_id || !editableItems.length) return;

    setIsCreating(true);
    try {
      // Create todos sequentially to avoid race conditions
      for (const item of editableItems) {
        await createTodo(proposed_list_for_task_id, {
          title: item.title.trim(),
          due_date: item.due_date,
          is_all_day: item.is_all_day,
          priority: "Medium",
        });
      }
    } catch (error) {
      console.error("Error creating todos:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden mt-4">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <ListTodo className="h-5 w-5 text-noki-primary" />
          <div className="font-poppins font-bold text-gray-100 text-lg">
            {title}
          </div>
        </div>

        {/* Task Information */}
        {proposed_list_for_task_id && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
            {taskLoading ? (
              <p className="text-sm text-gray-400 font-roboto">
                Loading task information...
              </p>
            ) : task ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-200 font-roboto">
                  Task: {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-gray-400 font-roboto">
                    {task.description}
                  </p>
                )}
                {(project || task.project) && (
                  <p className="text-xs text-gray-400 font-roboto">
                    Project:{" "}
                    {(project || task.project)?.title ||
                      (project || task.project)?.name}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-roboto">
                Task ID: {proposed_list_for_task_id}
              </p>
            )}
          </div>
        )}

        {/* Editable Items */}
        {editableItems.length > 0 && (
          <div className="space-y-3 mt-4">
            {editableItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                {item.isEditing ? (
                  <div className="space-y-4">
                    {/* Title Input */}
                    <div>
                      <label className="text-xs text-gray-400 font-roboto mb-1 block">
                        Title
                      </label>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, { title: e.target.value })
                        }
                        className="bg-gray-900 border-gray-600 text-gray-100"
                        placeholder="Enter todo title"
                      />
                    </div>

                    {/* Date/Time Picker */}
                    <div>
                      <label className="text-xs text-gray-400 font-roboto mb-1 block">
                        Due Date & Time
                      </label>
                      <DateTimePicker
                        value={new Date(item.due_date)}
                        onChange={(date) => handleDateChange(item.id, date)}
                        isAllDay={item.is_all_day}
                        onAllDayChange={(isAllDay) =>
                          handleAllDayChange(item.id, isAllDay)
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => toggleEdit(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleEdit(item.id)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-gray-100 font-roboto font-medium">
                          {item.title}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleEdit(item.id)}
                        className="text-gray-400 hover:text-noki-primary transition-colors p-1"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="font-roboto">
                          {formatDate(item.due_date, item.is_all_day)}
                        </span>
                      </div>
                      {!item.is_all_day && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="font-roboto">Time-specific</span>
                        </div>
                      )}
                      {item.is_all_day && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-xs bg-noki-primary/20 text-noki-primary px-2 py-0.5 rounded font-roboto">
                            All Day
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Todos Button */}
        {proposed_list_for_task_id && editableItems.length > 0 && (
          <div className="pt-4 border-t border-gray-700/50">
            <Button
              onClick={handleCreateTodos}
              disabled={isCreating}
              className="w-full bg-noki-primary hover:bg-noki-primary/90 text-white font-roboto"
            >
              {isCreating
                ? "Creating Todos..."
                : `Create ${editableItems.length} Todo${
                    editableItems.length > 1 ? "s" : ""
                  }`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
