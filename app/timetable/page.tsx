"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  ListTodo,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import { Select, TimePicker } from "antd";
import dayjs from "dayjs";
import { ManageProjectsModal } from "@/components/global/manage-projects-modal";
import { useMain } from "@/services/hooks/useMain";
import {
  utcToLocalDateString,
  utcToLocalTimeString,
  dateToLocalDateString,
  addHoursToTime as addHours,
} from "@/lib/timezone-config";

export default function TimetablePage() {
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">(
    "week"
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidenavCollapsed, setIsSidenavCollapsed] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [startHour, setStartHour] = useState(6); // Default: 6:00 AM
  const [endHour, setEndHour] = useState(2); // Default: 2:00 AM (next day)
  const [timeRangePreset, setTimeRangePreset] = useState("extended");

  // Data from IndexedDB
  const { getDB } = useMain();
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch data from IndexedDB
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const db = getDB();
        await db.init();

        console.log("[Timetable] Fetching data from IndexedDB...");

        // Fetch all tasks, todos, and projects
        const [fetchedTasks, fetchedTodos, fetchedProjects] = await Promise.all(
          [db.getTasks(), db.getTodos(), db.getProjects()]
        );

        console.log("[Timetable] Fetched data:", {
          tasks: fetchedTasks.length,
          todos: fetchedTodos.length,
          projects: fetchedProjects.length,
        });

        // Transform data to match timetable format
        const formattedTasks = fetchedTasks.map((task: any) => {
          // Find the project for this task to get color and details
          const project = fetchedProjects.find(
            (p: any) => p.id === task.project_id
          );

          // Determine color - use color_hex if available, otherwise fallback to color
          const projectColor = project?.color_hex || project?.color;
          const colorClass = projectColor?.startsWith("#")
            ? `bg-[${projectColor}]`
            : projectColor || "bg-noki-primary";

          // Get project title and course code
          const projectTitle = project?.title || project?.name || "General";
          const courseCode =
            project?.source === "Canvas" ? project?.course_code : null;

          // Build the subject display (shows project name or title with optional course code)
          const subjectDisplay = courseCode ? `${courseCode}` : projectTitle;

          // Determine if all-day and extract time from due_date if needed
          const isAllDay =
            task.is_all_day === true || task.is_all_day === "true";
          let startTime = task.start_time;
          let endTime = task.end_time;

          // If not all-day and no explicit times, extract from due_date
          if (!isAllDay && !startTime && (task.due_date || task.dueDate)) {
            const dueDate = task.due_date || task.dueDate;
            startTime = utcToLocalTimeString(dueDate);
            endTime = endTime || addHours(startTime, 1); // Default 1 hour duration
          }

          return {
            id: task.id,
            title: task.title || task.name || "Untitled Task",
            subject: subjectDisplay,
            projectTitle: projectTitle, // Full project title for reference
            courseCode: courseCode,
            type: "task" as const,
            dueDate: task.due_date || task.dueDate,
            allDay: isAllDay,
            startTime: startTime,
            endTime: endTime,
            color: colorClass,
            colorHex: project?.color_hex || null,
            borderColor: project?.color_hex
              ? `border-[${project.color_hex}]`
              : `border-${colorClass.replace("bg-", "")}`,
            textColor: project?.color_hex
              ? `text-[${project.color_hex}]`
              : `text-${colorClass.replace("bg-", "")}`,
            status: task.is_submitted
              ? "Completed"
              : task.status || "Not Started",
            priority: task.priority,
            source: project?.source || "manual",
          };
        });

        const formattedTodos = fetchedTodos.map((todo: any) => {
          // Find task and project for color and details
          const task = fetchedTasks.find((t: any) => t.id === todo.task_id);
          const project = task
            ? fetchedProjects.find((p: any) => p.id === task.project_id)
            : null;

          // Determine color - use color_hex if available
          const projectColor = project?.color_hex || project?.color;
          const colorClass = projectColor?.startsWith("#")
            ? `bg-[${projectColor}]`
            : projectColor || "bg-noki-secondary";

          // Get project title and course code
          const projectTitle = project?.title || project?.name || "General";
          const courseCode =
            project?.source === "Canvas" ? project?.course_code : null;

          // Build the subject display
          const subjectDisplay = courseCode ? `${courseCode}` : projectTitle;

          // Determine if all-day and extract time from due_date if needed
          const isAllDay =
            todo.is_all_day === true || todo.is_all_day === "true";
          let startTime = todo.start_time;
          let endTime = todo.end_time;

          // If not all-day and no explicit times, extract from due_date
          if (!isAllDay && !startTime && (todo.due_date || todo.dueDate)) {
            const dueDate = todo.due_date || todo.dueDate;
            startTime = utcToLocalTimeString(dueDate);
            endTime = endTime || addHours(startTime, 1); // Default 1 hour duration
          }

          return {
            id: todo.id,
            title: todo.title || todo.name || "Untitled Todo",
            subject: subjectDisplay,
            projectTitle: projectTitle,
            courseCode: courseCode,
            type: "todo" as const,
            dueDate: todo.due_date || todo.dueDate,
            allDay: isAllDay,
            startTime: startTime,
            endTime: endTime,
            color: colorClass,
            colorHex: project?.color_hex || null,
            borderColor: project?.color_hex
              ? `border-[${project.color_hex}]`
              : `border-${colorClass.replace("bg-", "")}`,
            textColor: project?.color_hex
              ? `text-[${project.color_hex}]`
              : `text-${colorClass.replace("bg-", "")}`,
            priority: todo.priority,
            source: project?.source || "manual",
          };
        });

        setTasks(formattedTasks);
        setTodos(formattedTodos);
        setProjects(fetchedProjects);

        console.log("[Timetable] Data loaded successfully (Timezone: UTC+2)");
        console.log("[Timetable] Formatted data sample:");
        if (formattedTasks.length > 0) {
          console.log("[Timetable] Sample formatted task:", formattedTasks[0]);
          console.log("[Timetable] Tasks with times:", {
            allDayTasks: formattedTasks.filter((t: any) => t.allDay).length,
            timedTasks: formattedTasks.filter((t: any) => !t.allDay).length,
            sampleTimedTask: formattedTasks.find(
              (t: any) => !t.allDay && t.startTime
            ),
          });
        }
        if (formattedTodos.length > 0) {
          console.log("[Timetable] Todos with times:", {
            allDayTodos: formattedTodos.filter((t: any) => t.allDay).length,
            timedTodos: formattedTodos.filter((t: any) => !t.allDay).length,
            sampleTimedTodo: formattedTodos.find(
              (t: any) => !t.allDay && t.startTime
            ),
          });
        }
        if (formattedTodos.length > 0) {
          console.log("[Timetable] Sample formatted todo:", formattedTodos[0]);
        }
      } catch (error) {
        console.error("[Timetable] Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const generateTimeSlots = (start: number, end: number): string[] => {
    const slots: string[] = [];
    const currentHour = start;

    // Handle wrapping around midnight
    const totalHours = end < start ? 24 - start + end + 1 : end - start + 1;

    for (let i = 0; i < totalHours; i++) {
      const hour = (currentHour + i) % 24;
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(startHour, endHour);

  const handlePresetChange = (preset: string) => {
    setTimeRangePreset(preset);
    switch (preset) {
      case "work":
        setStartHour(6);
        setEndHour(18);
        break;
      case "extended":
        setStartHour(6);
        setEndHour(2);
        break;
      case "full":
        setStartHour(0);
        setEndHour(23);
        break;
    }
  };

  // Keep events as empty for now - can be integrated with timetable events later
  const events: any[] = [];

  const getDateString = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split("T")[0];
  };

  // Tasks and todos are now loaded from IndexedDB - see state at top of component

  // Generate assignments from tasks (for the assignments view if needed)
  const assignments = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    subject: task.subject,
    subjectName: task.subject,
    type: "Assignment",
    dueDate: task.dueDate,
    status: task.status,
    color: task.color,
  }));

  // Generate subjects dynamically from projects
  const subjects = [
    "All Subjects",
    ...Array.from(new Set(projects.map((p) => p.name))),
  ];
  const types = ["All Types", "Personal", "Assignment", "Event"];
  const dateFilters = ["All Dates", "This Week", "Next Week", "This Month"];

  const filteredAssignments = assignments
    .filter(
      (assignment) =>
        selectedSubject === "All Subjects" ||
        assignment.subject === selectedSubject
    )
    .filter(
      (assignment) =>
        selectedType === "All Types" || assignment.type === selectedType
    )
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const doTimesOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean => {
    const start1Min = timeToMinutes(start1);
    const end1Min = timeToMinutes(end1);
    const start2Min = timeToMinutes(start2);
    const end2Min = timeToMinutes(end2);

    return start1Min < end2Min && start2Min < end1Min;
  };

  const calculatePrecisePosition = (
    startTime: string,
    endTime: string,
    pixelsPerHour = 64
  ) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const startMinutesFromDayStart = startMinutes - startHour * 60;

    const top = (startMinutesFromDayStart / 60) * pixelsPerHour;
    const durationMinutes = endMinutes - startMinutes;
    const height = (durationMinutes / 60) * pixelsPerHour;

    return { top, height };
  };

  const organizeOverlappingItems = (items: any[]) => {
    if (items.length === 0) return [];

    // Sort items by start time
    const sortedItems = [...items].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    // Group items that overlap with each other
    const overlapGroups: any[][] = [];

    sortedItems.forEach((item) => {
      // Find which group this item belongs to (overlaps with any item in the group)
      let foundGroup = false;

      for (const group of overlapGroups) {
        const overlapsWithGroup = group.some((groupItem) =>
          doTimesOverlap(
            item.startTime,
            item.endTime,
            groupItem.startTime,
            groupItem.endTime
          )
        );

        if (overlapsWithGroup) {
          group.push(item);
          foundGroup = true;
          break;
        }
      }

      // If no overlapping group found, create a new group
      if (!foundGroup) {
        overlapGroups.push([item]);
      }
    });

    // For each group, assign columns independently
    const itemsWithColumns: any[] = [];

    overlapGroups.forEach((group) => {
      const columns: any[][] = [];

      group.forEach((item) => {
        let placed = false;

        // Try to place in existing column
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          const hasOverlap = column.some((existingItem) =>
            doTimesOverlap(
              item.startTime,
              item.endTime,
              existingItem.startTime,
              existingItem.endTime
            )
          );

          if (!hasOverlap) {
            column.push(item);
            placed = true;
            break;
          }
        }

        // Create new column if couldn't place
        if (!placed) {
          columns.push([item]);
        }
      });

      // Assign column info to each item in this group
      group.forEach((item) => {
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
          if (columns[colIndex].includes(item)) {
            itemsWithColumns.push({
              ...item,
              columnIndex: colIndex,
              totalColumns: columns.length,
            });
            break;
          }
        }
      });
    });

    return itemsWithColumns;
  };

  const getTypeIcon = (type: "todo" | "task" | "event") => {
    switch (type) {
      case "todo":
        return <ListTodo size={12} className="flex-shrink-0 pt-0" />;
      case "task":
        return <ClipboardList size={12} className="flex-shrink-0" />;
      case "event":
        return <CalendarDays size={12} className="flex-shrink-0" />;
    }
  };

  const calculateTimeIndicatorPosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const isInRange =
      endHour < startHour
        ? hours >= startHour || hours <= endHour
        : hours >= startHour && hours <= endHour;

    if (!isInRange) return null;

    // Calculate hours since start, handling midnight crossover
    let hoursSinceStart;
    if (endHour < startHour) {
      // Range crosses midnight
      if (hours >= startHour) {
        hoursSinceStart = hours - startHour;
      } else {
        hoursSinceStart = 24 - startHour + hours;
      }
    } else {
      hoursSinceStart = hours - startHour;
    }

    const minutesFraction = minutes / 60;
    const totalHours = hoursSinceStart + minutesFraction;

    return totalHours;
  };

  const getTasksAndTodosForDate = (date: Date) => {
    // Get local date string from the calendar date
    const dateStr = dateToLocalDateString(date);

    // Compare date parts after converting UTC dates to local timezone
    const dateTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskLocalDate = utcToLocalDateString(task.dueDate);
      return taskLocalDate === dateStr;
    });

    const dateTodos = todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoLocalDate = utcToLocalDateString(todo.dueDate);
      return todoLocalDate === dateStr;
    });

    console.log("[Timetable Filter] Date:", dateStr, {
      totalTasks: tasks.length,
      totalTodos: todos.length,
      matchedTasks: dateTasks.length,
      matchedTodos: dateTodos.length,
    });

    // Log some task dates for comparison
    if (tasks.length > 0 && dateTasks.length === 0) {
      console.log(
        "[Timetable Filter] Sample task dates (UTC+2):",
        tasks.slice(0, 3).map((t) => {
          if (!t.dueDate) return null;
          return `${utcToLocalDateString(t.dueDate)} ${utcToLocalTimeString(
            t.dueDate
          )}`;
        })
      );
    }

    return [...dateTasks, ...dateTodos];
  };

  const renderMonthView = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="min-h-16 bg-secondary rounded-lg sm:min-h-[120px] flex items-start"
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((event) => {
        // Simple filter for demonstration; adjust as needed for actual calendar logic
        const eventDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        const eventDayOfWeek = eventDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        return event.day === eventDayOfWeek;
      });

      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayItems = getTasksAndTodosForDate(dayDate);

      const handleDayClick = () => {
        const selectedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        setCurrentDate(selectedDate);
        setCurrentView("day");
      };

      const isToday = isCurrentMonth && day === today.getDate();

      const allDayItems = [...dayEvents, ...dayItems];

      days.push(
        <div
          key={day}
          onClick={handleDayClick}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
          className={`min-h-16 sm:min-h-32 border rounded-lg p-1 sm:p-2 hover:bg-secondary transition-all flex flex-col relative cursor-pointer ${
            isToday
              ? "bg-noki-primary/10 border-noki-primary ring-2 ring-noki-primary/30 shadow-lg"
              : "bg-card border-border"
          }`}
        >
          <div
            className={`font-semibold text-xs sm:text-sm mb-1 flex-shrink-0 ${
              isToday ? "text-noki-primary font-bold" : "text-foreground"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1 flex-1 overflow-visible">
            {dayItems.slice(0, 2).map((item) => {
              if (item.type === "todo") {
                return (
                  <div
                    key={item.id}
                    className="border-2 bg-transparent text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-md flex items-center gap-1 truncate font-medium"
                    style={{
                      borderColor: item.colorHex || undefined,
                      color: item.colorHex || undefined,
                    }}
                  >
                    {getTypeIcon(item.type)}
                    <span className="truncate">{item.title}</span>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    className="border-2 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-md flex items-center gap-1 truncate font-medium"
                    style={{
                      borderColor: item.colorHex || undefined,
                      backgroundColor: item.colorHex
                        ? `${item.colorHex}50`
                        : undefined,
                    }}
                  >
                    {getTypeIcon(item.type)}
                    <span className="truncate">{item.title}</span>
                  </div>
                );
              }
            })}
            {dayEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="relative z-10">
                <div
                  className={`${event.color} text-white text-xs px-1 sm:px-2 py-1 rounded flex items-center gap-1 truncate flex-shrink-0`}
                >
                  {getTypeIcon(event.type)}
                  <span className="truncate">{event.code}</span>
                </div>
              </div>
            ))}
            {dayEvents.length + dayItems.length > 4 && (
              <div className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                +{dayEvents.length + dayItems.length - 4} more
              </div>
            )}
          </div>

          {hoveredDay === day && allDayItems.length > 0 && (
            <div
              className="fixed z-[9999] w-80 bg-card rounded-xl shadow-2xl border border-border p-4 pointer-events-none overflow-y-auto transition-opacity duration-200"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                opacity: hoveredDay === day ? 1 : 0,
              }}
            >
              <div className="mb-3 pb-3 border-b border-border">
                <h4 className="font-semibold text-foreground text-base">
                  {dayDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {allDayItems.length}{" "}
                  {allDayItems.length === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-secondary/50 rounded-lg p-3 border border-border/50"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`${event.color} w-1 h-full rounded-full flex-shrink-0`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(event.type)}
                          <span
                            className={`${event.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}
                          >
                            {event.code}
                          </span>
                        </div>
                        <h5 className="font-semibold text-foreground text-sm leading-tight">
                          {event.title}
                        </h5>
                      </div>
                    </div>

                    <div className="space-y-1.5 ml-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock
                          size={12}
                          className="text-noki-primary flex-shrink-0"
                        />
                        <span className="text-xs">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin
                          size={12}
                          className="text-noki-primary flex-shrink-0"
                        />
                        <span className="text-xs">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users
                          size={12}
                          className="text-noki-primary flex-shrink-0"
                        />
                        <span className="text-xs">{event.instructor}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-secondary/50 rounded-lg p-3 border border-border/50"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(item.type)}
                          <span
                            className={`${
                              item.type === "todo"
                                ? "border bg-transparent"
                                : "text-white"
                            } text-xs px-2 py-0.5 rounded-full font-medium`}
                            style={{
                              ...(item.type === "todo"
                                ? {
                                    borderColor: item.colorHex || undefined,
                                    color: item.colorHex || undefined,
                                  }
                                : {
                                    backgroundColor: item.colorHex
                                      ? `${item.colorHex}50`
                                      : undefined,
                                  }),
                            }}
                          >
                            {item.subject}
                          </span>
                        </div>
                        <h5 className="font-semibold text-foreground text-sm leading-tight mb-1">
                          {item.title}
                        </h5>
                        {!item.allDay && item.startTime && item.endTime && (
                          <div className="flex items-center gap-2 text-muted-foreground ml-4">
                            <Clock
                              size={12}
                              className="text-noki-primary flex-shrink-0"
                            />
                            <span className="text-xs">
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>
                        )}
                        {item.allDay && (
                          <div className="flex items-center gap-2 text-muted-foreground ml-4">
                            <Calendar
                              size={12}
                              className="text-noki-primary flex-shrink-0"
                            />
                            <span className="text-xs">All Day</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-1 sm:p-2 text-center font-semibold text-muted-foreground text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const timeIndicatorPosition = calculateTimeIndicatorPosition();
    const weekViewSlotHeight =
      typeof window !== "undefined" && window.innerWidth < 640 ? 64 : 80;
    const today = new Date();

    return (
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-noki-primary/30 scrollbar-track-secondary">
        <div className="grid grid-cols-8 gap-3 sm:gap-6 min-w-[1400px]">
          <div className="space-y-0">
            <div className="h-24"></div>
            <div className="h-8 sm:h-12"></div>
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-20 flex items-start justify-end pr-2 sm:pr-4 text-xs sm:text-sm text-muted-foreground pt-8"
              >
                {time}
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => {
            const weekStart = new Date(currentDate);
            weekStart.setDate(
              currentDate.getDate() - currentDate.getDay() + 1 + dayIndex
            );
            const dayItems = getTasksAndTodosForDate(weekStart);
            const allDayItems = dayItems.filter((item) => item.allDay);
            const timedItems = dayItems.filter((item) => !item.allDay);

            const isToday =
              weekStart.getDate() === today.getDate() &&
              weekStart.getMonth() === today.getMonth() &&
              weekStart.getFullYear() === today.getFullYear();

            const dayEvents = events.filter((event) => event.day === day);
            const allTimedItems = [...dayEvents, ...timedItems];

            const organizedItems = organizeOverlappingItems(allTimedItems);

            return (
              <div key={day} className="space-y-2 sm:space-y-4">
                <div className="h-24 bg-secondary/50 rounded-lg p-2 border border-border overflow-y-auto">
                  <div className="text-[10px] text-muted-foreground mb-1 font-medium">
                    All Day
                  </div>
                  <div className="space-y-1">
                    {allDayItems.map((item) => {
                      if (item.type === "todo") {
                        return (
                          <div
                            key={item.id}
                            className="border-2 bg-transparent text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-medium"
                            style={{
                              borderColor: item.colorHex || undefined,
                              color: item.colorHex || undefined,
                            }}
                          >
                            {getTypeIcon(item.type)}
                            <span
                              className="truncate"
                              title={item.projectTitle}
                            >
                              {item.subject}: {item.title}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={item.id}
                            className="border-2 bg-opacity-30 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1"
                            style={{
                              borderColor: item.colorHex || undefined,
                              backgroundColor: item.colorHex
                                ? `${item.colorHex}50`
                                : undefined,
                            }}
                          >
                            {getTypeIcon(item.type)}
                            <span
                              className="truncate"
                              title={item.projectTitle}
                            >
                              {item.subject}: {item.title}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>

                <div
                  className={`h-8 sm:h-12 flex items-center justify-center rounded-lg transition-all ${
                    isToday
                      ? "bg-noki-primary/10 border-2 border-noki-primary/30"
                      : ""
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`font-semibold text-xs sm:text-sm truncate ${
                        isToday
                          ? "text-noki-primary font-bold"
                          : "text-foreground"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </div>
                    <div
                      className={`text-xs ${
                        isToday ? "text-noki-primary" : "text-muted-foreground"
                      }`}
                    >
                      {weekStart.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className="relative"
                  style={{
                    height: `${timeSlots.length * weekViewSlotHeight}px`,
                  }}
                >
                  {timeSlots.map((time, index) => (
                    <div
                      key={time}
                      className="absolute left-0 right-0 border-t border-border"
                      style={{
                        top: `${index * weekViewSlotHeight}px`,
                        height: `${weekViewSlotHeight}px`,
                      }}
                    />
                  ))}

                  {organizedItems.map((item) => {
                    const position = calculatePrecisePosition(
                      item.startTime,
                      item.endTime,
                      weekViewSlotHeight
                    );
                    const widthPercent = 100 / item.totalColumns;
                    const leftPercent = widthPercent * item.columnIndex;

                    if (item.type === "event") {
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`${
                            item.color
                          } text-white p-3 rounded-lg shadow-md absolute border-2 border-white/20 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${
                            hoveredItem === item.id ? "z-[100]" : "z-10"
                          }`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 1}%`,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeIcon(item.type)}
                            <span className="font-semibold text-sm truncate flex-1 min-w-0">
                              {item.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 justify-between">
                            <span className="text-xs opacity-90 flex-shrink-0">
                              {item.startTime}
                            </span>
                            <span className="text-xs opacity-90 flex-shrink-0">
                              {item.endTime}
                            </span>
                          </div>
                          <div className="text-xs opacity-75 truncate mt-1">
                            {item.title}
                          </div>

                          {hoveredItem === item.id && (
                            <div
                              className="fixed z-[9999] w-72 bg-card rounded-xl shadow-2xl border border-border p-4 pointer-events-none"
                              style={{
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(item.type)}
                                  <span
                                    className="text-white text-xs px-2 py-1 rounded-full font-medium"
                                    style={{
                                      backgroundColor:
                                        item.colorHex || undefined,
                                    }}
                                  >
                                    {item.code}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-foreground text-base">
                                  {item.title}
                                </h5>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock
                                      size={14}
                                      className="text-noki-primary flex-shrink-0"
                                    />
                                    <span className="text-sm">
                                      {item.startTime} - {item.endTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin
                                      size={14}
                                      className="text-noki-primary flex-shrink-0"
                                    />
                                    <span className="text-sm">
                                      {item.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users
                                      size={14}
                                      className="text-noki-primary flex-shrink-0"
                                    />
                                    <span className="text-sm">
                                      {item.instructor}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } else if (item.type === "todo") {
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`border-2 bg-card p-3 rounded-lg shadow-md absolute font-medium overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${
                            hoveredItem === item.id ? "z-[100]" : "z-10"
                          }`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 1}%`,
                            borderColor: item.colorHex || undefined,
                            color: item.colorHex || undefined,
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {getTypeIcon(item.type)}
                              <span className="font-semibold text-sm truncate">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-xs opacity-90 flex-shrink-0 whitespace-nowrap">
                              {item.startTime}
                            </span>
                          </div>

                          {hoveredItem === item.id && (
                            <div
                              className="fixed z-[9999] w-72 bg-card rounded-xl shadow-2xl border border-border p-4 pointer-events-none"
                              style={{
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(item.type)}
                                  <span
                                    className="border-2 bg-transparent text-xs px-2 py-1 rounded-full font-medium"
                                    style={{
                                      borderColor: item.colorHex || undefined,
                                      color: item.colorHex || undefined,
                                    }}
                                  >
                                    {item.subject}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-foreground text-base">
                                  {item.title}
                                </h5>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock
                                      size={14}
                                      className="text-noki-primary flex-shrink-0"
                                    />
                                    <span className="text-sm">
                                      {item.startTime} - {item.endTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`border-2 text-white p-3 rounded-lg shadow-md absolute z-10 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${
                            hoveredItem === item.id ? "z-[100]" : "z-10"
                          }`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 1}%`,
                            borderColor: item.colorHex || undefined,
                            backgroundColor: item.colorHex
                              ? `${item.colorHex}50`
                              : undefined,
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {getTypeIcon(item.type)}
                              <span className="font-semibold text-sm truncate">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-xs opacity-90 flex-shrink-0 whitespace-nowrap">
                              {item.startTime}
                            </span>
                          </div>

                          {hoveredItem === item.id && (
                            <div
                              className="fixed z-[9999] w-72 bg-card rounded-xl shadow-2xl border border-border p-4 pointer-events-none"
                              style={{
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(item.type)}
                                  <span
                                    className="text-white text-xs px-2 py-1 rounded-full font-medium"
                                    style={{
                                      backgroundColor: item.colorHex
                                        ? `${item.colorHex}50`
                                        : undefined,
                                    }}
                                  >
                                    {item.subject}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-foreground text-base">
                                  {item.title}
                                </h5>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock
                                      size={14}
                                      className="text-noki-primary flex-shrink-0"
                                    />
                                    <span className="text-sm">
                                      {item.startTime} - {item.endTime}
                                    </span>
                                  </div>
                                  {item.status && (
                                    <div className="text-sm text-muted-foreground">
                                      Status:{" "}
                                      <span className="font-medium">
                                        {item.status}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}

                  {timeIndicatorPosition !== null && isToday && (
                    <div
                      className="absolute left-0 right-0 z-20 pointer-events-none"
                      style={{
                        top: `${timeIndicatorPosition * weekViewSlotHeight}px`,
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-lg animate-pulse"></div>
                        <div className="flex-1 h-0.5 bg-red-500 shadow-lg"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    // Get events for the current day (assuming 'Monday' is a placeholder and should be dynamic)
    const currentDayOfWeek = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const todayEvents = events.filter(
      (event) => event.day === currentDayOfWeek
    );

    const dayItems = getTasksAndTodosForDate(currentDate);
    const allDayItems = dayItems.filter((item) => item.allDay);
    const timedItems = dayItems.filter((item) => !item.allDay);

    const timeIndicatorPosition = calculateTimeIndicatorPosition();
    const dayViewSlotHeight =
      typeof window !== "undefined" && window.innerWidth < 640 ? 64 : 80;

    const allTimedItems = [...todayEvents, ...timedItems];
    const organizedItems = organizeOverlappingItems(allTimedItems);

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            {allDayItems.length > 0 && (
              <div className="mb-4 bg-card rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Calendar size={14} />
                  All Day Tasks & Todos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allDayItems.map((item) => {
                    if (item.type === "todo") {
                      return (
                        <div
                          key={item.id}
                          className="border-2 py-2 px-2 bg-card p-3 rounded-lg shadow-sm flex gap-2 font-medium items-center"
                          style={{
                            borderColor: item.colorHex || undefined,
                            color: item.colorHex || undefined,
                          }}
                        >
                          {getTypeIcon(item.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {item.title}
                            </div>
                            <div className="text-xs opacity-75">
                              {item.subject}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={item.id}
                          className="border-2 text-white p-3 rounded-lg shadow-sm flex gap-2 items-center"
                          style={{
                            borderColor: item.colorHex || undefined,
                            backgroundColor: item.colorHex
                              ? `${item.colorHex}50`
                              : undefined,
                          }}
                        >
                          {getTypeIcon(item.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {item.title}
                            </div>
                            <div className="text-xs opacity-75">
                              {item.subject}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
              <div className="space-y-0 w-16 sm:w-20">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-16 sm:h-20 flex items-start justify-end pr-2 sm:pr-3 text-xs sm:text-sm text-muted-foreground border-r border-border pt-0"
                  >
                    {time}
                  </div>
                ))}
              </div>

              <div
                className="relative"
                style={{ height: `${timeSlots.length * dayViewSlotHeight}px` }}
              >
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="absolute left-0 right-0 border-t border-border"
                    style={{
                      top: `${index * dayViewSlotHeight}px`,
                      height: `${dayViewSlotHeight}px`,
                    }}
                  />
                ))}

                {organizedItems.map((item) => {
                  const position = calculatePrecisePosition(
                    item.startTime,
                    item.endTime,
                    dayViewSlotHeight
                  );
                  const widthPercent = 100 / item.totalColumns;
                  const leftPercent = widthPercent * item.columnIndex;

                  if (item.type === "event") {
                    return (
                      <div
                        key={item.id}
                        className="text-white p-3 rounded-lg shadow-lg absolute z-10 border-2 border-white/20 overflow-hidden"
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent - 1}%`,
                          backgroundColor: item.colorHex || undefined,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getTypeIcon(item.type)}
                            <span className="font-semibold text-sm sm:text-base truncate">
                              {item.title}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm opacity-90 flex items-center gap-2 mb-1">
                          <Clock size={12} className="flex-shrink-0" />
                          <span className="truncate">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm opacity-75 flex items-center gap-2 hidden sm:flex">
                          <Users size={12} className="flex-shrink-0" />
                          <span className="truncate">{item.instructor}</span>
                        </div>
                      </div>
                    );
                  } else if (item.type === "todo") {
                    return (
                      <div
                        key={item.id}
                        className="border-2 px-2 py-2 bg-card p-3 rounded-lg shadow-lg absolute z-10 font-medium overflow-hidden"
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent - 1}%`,
                          borderColor: item.colorHex || undefined,
                          color: item.colorHex || undefined,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getTypeIcon(item.type)}
                            <span className="font-semibold text-sm sm:text-base truncate">
                              {item.title}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm opacity-90 flex items-center justify-between gap-2">
                          <Clock size={12} className="flex-shrink-0" />
                          <span className="truncate flex-1">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={item.id}
                        className="border-2 px-2 py-2 text-white p-3 rounded-lg shadow-lg absolute z-10 overflow-hidden"
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent - 1}%`,
                          borderColor: item.colorHex || undefined,
                          backgroundColor: item.colorHex
                            ? `${item.colorHex}50`
                            : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getTypeIcon(item.type)}
                            <span className="font-semibold text-sm sm:text-base truncate">
                              {item.title}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm opacity-90 flex items-center justify-between gap-2">
                          <Clock size={12} className="flex-shrink-0" />
                          <span className="truncate flex-1">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}

                {timeIndicatorPosition !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none"
                    style={{
                      top: `${timeIndicatorPosition * dayViewSlotHeight}px`,
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 -ml-1.5 shadow-lg animate-pulse"></div>
                      <div className="flex-1 h-0.5 bg-red-500 shadow-lg"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 hidden lg:block">
            <h3 className="font-poppins font-semibold text-lg text-foreground">
              Today's Schedule
            </h3>
            <div className="space-y-3 sticky top-22">
              {allDayItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card p-4 rounded-xl shadow-sm border border-border"
                >
                  <div className="space-y-2">
                    <span
                      className={`${
                        item.type === "todo"
                          ? "border-2 bg-transparent"
                          : "text-white"
                      } text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1`}
                      style={{
                        ...(item.type === "todo"
                          ? {
                              borderColor: item.colorHex || undefined,
                              color: item.colorHex || undefined,
                            }
                          : {
                              backgroundColor: item.colorHex || undefined,
                            }),
                      }}
                    >
                      {getTypeIcon(item.type)}
                      {item.subject}
                    </span>
                    <div className="font-medium text-foreground flex items-center gap-2">
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      All Day
                    </span>
                  </div>
                </div>
              ))}
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-card p-4 rounded-xl shadow-sm border border-border"
                >
                  <div className="space-y-2">
                    <span
                      className="text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: event.colorHex || undefined,
                      }}
                    >
                      {getTypeIcon(event.type)}
                      {event.code}
                    </span>
                    <div className="font-medium text-foreground truncate">
                      {event.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {event.location}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {event.instructor}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-noki-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading timetable data...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no data
  const hasData = tasks.length > 0 || todos.length > 0;

  console.log("[Timetable Render] Current state:", {
    isLoading,
    hasData,
    tasksLength: tasks.length,
    todosLength: todos.length,
  });

  if (!hasData && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-foreground">
            No Tasks or Todos Yet
          </h3>
          <p className="text-muted-foreground">
            Your timetable is empty. Add some tasks and todos to see them here!
          </p>
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-noki-primary hover:bg-noki-primary/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-noki-primary/20"
          >
            <Plus size={18} />
            Add Your First Task
          </button>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              💡 <strong>Tip:</strong> Tasks with dates and times will appear in
              the calendar views
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm sm:text-base truncate">
              {formatDate(currentDate)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-noki-primary hover:bg-noki-primary/90 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-noki-primary/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Manage</span>
            </button>

            <div className="bg-secondary p-1 rounded-lg flex">
              {(["month", "week", "day"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    currentView === view
                      ? "bg-noki-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate("prev")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft
              size={16}
              className="sm:w-5 sm:h-5 text-muted-foreground"
            />
          </button>

          <div className="flex items-center gap-2">
            <Calendar
              size={14}
              className="sm:w-4 sm:h-4 text-muted-foreground"
            />
            <span className="font-medium text-foreground text-sm sm:text-base truncate">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                ...(currentView === "day" && { day: "numeric" }),
              })}
            </span>
          </div>

          <button
            onClick={() => navigateDate("next")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronRight
              size={16}
              className="sm:w-5 sm:h-5 text-muted-foreground"
            />
          </button>
        </div>

        {(currentView === "week" || currentView === "day") && (
          <div className="sticky top-4 bg-card rounded-xl border border-border p-3 z-50">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-noki-primary" />
                <div className="text-sm font-medium text-foreground">
                  Time Range:
                </div>
              </div>

              <Select
                value={timeRangePreset}
                onChange={(value) => handlePresetChange(value)}
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: "work", label: "Work Hours (6AM - 6PM)" },
                  { value: "extended", label: "Extended (6AM - 2AM)" },
                  { value: "full", label: "Full Day (12AM - 11PM)" },
                  { value: "custom", label: "Custom" },
                ]}
              />

              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">From:</div>
                <TimePicker
                  value={dayjs().hour(startHour).minute(0)}
                  onChange={(time) => {
                    if (time) {
                      setStartHour(time.hour());
                      setTimeRangePreset("custom");
                    }
                  }}
                  format="HH:00"
                  size="small"
                  showNow={false}
                  style={{ width: 80 }}
                />
                <div className="text-xs text-muted-foreground">To:</div>
                <TimePicker
                  value={dayjs().hour(endHour).minute(0)}
                  onChange={(time) => {
                    if (time) {
                      setEndHour(time.hour());
                      setTimeRangePreset("custom");
                    }
                  }}
                  format="HH:00"
                  size="small"
                  showNow={false}
                  style={{ width: 80 }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-sm border border-border p-3 sm:p-6">
          {currentView === "month" && renderMonthView()}
          {currentView === "week" && renderWeekView()}
          {currentView === "day" && renderDayView()}
        </div>

        <ManageProjectsModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
        />
      </div>
    </div>
  );
}
