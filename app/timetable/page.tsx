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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const events = [
    {
      id: "1",
      title: "Interactive Development 300",
      code: "DV300",
      startTime: "09:00",
      endTime: "11:00",
      location: "Lab A",
      instructor: "Prof. Smith",
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
      day: "Monday",
      type: "event" as const,
    },
    {
      id: "2",
      title: "Photography 300",
      code: "PH300",
      startTime: "13:00",
      endTime: "15:00",
      location: "Studio B",
      instructor: "Prof. Johnson",
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
      day: "Monday",
      type: "event" as const,
    },
    {
      id: "3",
      title: "Visual Culture 300",
      code: "VC300",
      startTime: "10:00",
      endTime: "12:00",
      location: "Room 201",
      instructor: "Dr. Williams",
      color: "bg-orange-400",
      borderColor: "border-orange-400",
      textColor: "text-orange-400",
      day: "Tuesday",
      type: "event" as const,
    },
    {
      id: "4",
      title: "Experimental Learning 300",
      code: "PH300",
      startTime: "14:00",
      endTime: "16:00",
      location: "Workshop",
      instructor: "Prof. Brown",
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
      day: "Wednesday",
      type: "event" as const,
    },
    {
      id: "5",
      title: "Study Group",
      code: "Personal",
      startTime: "09:00",
      endTime: "10:30",
      location: "Library",
      instructor: "Study Session",
      color: "bg-purple-400",
      borderColor: "border-purple-400",
      textColor: "text-purple-400",
      day: "Monday",
      type: "event" as const,
    },
    {
      id: "6",
      title: "Team Meeting",
      code: "Personal",
      startTime: "10:00",
      endTime: "11:00",
      location: "Room 105",
      instructor: "Group Work",
      color: "bg-purple-400",
      borderColor: "border-purple-400",
      textColor: "text-purple-400",
      day: "Tuesday",
      type: "event" as const,
    },
  ];

  const getDateString = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split("T")[0];
  };

  const todos = [
    {
      id: "todo1",
      title: "Review lecture notes",
      subject: "DV300",
      type: "todo" as const,
      dueDate: getDateString(0),
      allDay: true,
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
    },
    {
      id: "todo2",
      title: "Buy camera equipment",
      subject: "PH300",
      type: "todo" as const,
      dueDate: getDateString(1),
      allDay: false,
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
    },
    {
      id: "todo3",
      title: "Read chapter 5",
      subject: "VC300",
      type: "todo" as const,
      dueDate: getDateString(2),
      allDay: true,
      color: "bg-orange-400",
      borderColor: "border-orange-400",
      textColor: "text-orange-400",
    },
    {
      id: "todo4",
      title: "Team meeting prep",
      subject: "Personal",
      type: "todo" as const,
      dueDate: getDateString(3),
      allDay: false,
      startTime: "16:00",
      endTime: "17:00",
      color: "bg-purple-400",
      borderColor: "border-purple-400",
      textColor: "text-purple-400",
    },
    {
      id: "todo5",
      title: "Update portfolio website",
      subject: "Personal",
      type: "todo" as const,
      dueDate: getDateString(0),
      allDay: false,
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-purple-400",
      borderColor: "border-purple-400",
      textColor: "text-purple-400",
    },
    {
      id: "todo6",
      title: "Practice photography techniques",
      subject: "PH300",
      type: "todo" as const,
      dueDate: getDateString(4),
      allDay: true,
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
    },
    {
      id: "todo7",
      title: "Email professor",
      subject: "DV300",
      type: "todo" as const,
      dueDate: getDateString(0),
      allDay: false,
      startTime: "10:00",
      endTime: "10:30",
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
    },
  ];

  const tasks = [
    {
      id: "t1",
      title: "40 images for commercial portfolio",
      subject: "PH300",
      type: "task" as const,
      dueDate: getDateString(0),
      allDay: true,
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
      status: "Not Started",
    },
    {
      id: "t2",
      title: "Start planning mobile app",
      subject: "DV300",
      type: "task" as const,
      dueDate: getDateString(1),
      allDay: false,
      startTime: "15:00",
      endTime: "17:00",
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
      status: "In Progress",
    },
    {
      id: "t3",
      title: "Research Methods Essay",
      subject: "VC300",
      type: "task" as const,
      dueDate: getDateString(5),
      allDay: true,
      color: "bg-orange-400",
      borderColor: "border-orange-400",
      textColor: "text-orange-400",
      status: "Not Started",
    },
    {
      id: "t4",
      title: "Weekly Project Review",
      subject: "Personal",
      type: "task" as const,
      dueDate: getDateString(2),
      allDay: true,
      color: "bg-purple-400",
      borderColor: "border-purple-400",
      textColor: "text-purple-400",
      status: "Completed",
    },
    {
      id: "t5",
      title: "Portfolio Presentation",
      subject: "PH300",
      type: "task" as const,
      dueDate: getDateString(6),
      allDay: false,
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
      status: "Not Started",
    },
    {
      id: "t6",
      title: "Code review session",
      subject: "DV300",
      type: "task" as const,
      dueDate: getDateString(0),
      allDay: false,
      startTime: "09:30",
      endTime: "10:30",
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
      status: "Not Started",
    },
    {
      id: "t7",
      title: "Edit photo series",
      subject: "PH300",
      type: "task" as const,
      dueDate: getDateString(3),
      allDay: false,
      startTime: "09:00",
      endTime: "11:00",
      color: "bg-noki-tertiary",
      borderColor: "border-noki-tertiary",
      textColor: "text-noki-tertiary",
      status: "In Progress",
    },
    {
      id: "t8",
      title: "Database design document",
      subject: "DV300",
      type: "task" as const,
      dueDate: getDateString(4),
      allDay: true,
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
      status: "Not Started",
    },
    {
      id: "t9",
      title: "UI mockups",
      subject: "DV300",
      type: "task" as const,
      dueDate: getDateString(0),
      allDay: false,
      startTime: "10:15",
      endTime: "11:30",
      color: "bg-noki-primary",
      borderColor: "border-noki-primary",
      textColor: "text-noki-primary",
      status: "In Progress",
    },
  ];

  const assignments = [
    {
      id: "1",
      title: "40 images for commercial portfolio",
      subject: "PH300",
      subjectName: "Photography 300",
      type: "Assignment",
      dueDate: "2024-09-21",
      status: "Not Started",
      color: "bg-noki-tertiary",
    },
    {
      id: "2",
      title: "Start your planning and outlining of your mobile app",
      subject: "DV300",
      subjectName: "Interactive Development 300",
      type: "Assignment",
      dueDate: "2024-09-21",
      status: "In Progress",
      color: "bg-noki-primary",
    },
    {
      id: "3",
      title: "Research Methods Essay",
      subject: "VC300",
      subjectName: "Visual Culture 300",
      type: "Assignment",
      dueDate: "2024-09-25",
      status: "Not Started",
      color: "bg-orange-400",
    },
    {
      id: "4",
      title: "Weekly Project Review",
      subject: "Personal",
      subjectName: "Personal Task",
      type: "Personal",
      dueDate: "2024-09-23",
      status: "Completed",
      color: "bg-gray-400",
    },
    {
      id: "5",
      title: "Portfolio Presentation",
      subject: "PH300",
      subjectName: "Photography 300",
      type: "Event",
      dueDate: "2024-09-28",
      status: "Not Started",
      color: "bg-noki-tertiary",
    },
  ];

  const subjects = ["All Subjects", "DV300", "PH300", "VC300", "Personal"];
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
    const dateStr = date.toISOString().split("T")[0];
    const dateTasks = tasks.filter((task) => task.dueDate === dateStr);
    const dateTodos = todos.filter((todo) => todo.dueDate === dateStr);
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
                    className={`border-2 ${item.borderColor} ${item.textColor} bg-transparent text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-md flex items-center gap-1 truncate font-medium`}
                  >
                    {getTypeIcon(item.type)}
                    <span className="truncate">{item.title}</span>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    className={`border-2 ${item.borderColor} ${item.color} bg-opacity-30 ${item.textColor} text-[10px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-md flex items-center gap-1 truncate font-medium`}
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
                                ? `border ${item.borderColor} ${item.textColor} bg-transparent`
                                : `${item.color} bg-opacity-30 ${item.textColor}`
                            } text-xs px-2 py-0.5 rounded-full font-medium`}
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
                            className={`border-2 ${item.borderColor} ${item.textColor} bg-transparent text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-medium`}
                          >
                            {getTypeIcon(item.type)}
                            <span className="truncate">{item.title}</span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={item.id}
                            className={`border-2 ${item.borderColor} ${item.color} bg-opacity-30 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1`}
                          >
                            {getTypeIcon(item.type)}
                            <span className="truncate">{item.title}</span>
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
                                    className={`${item.color} text-white text-xs px-2 py-1 rounded-full font-medium`}
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
                          className={`border-2 ${item.borderColor} ${
                            item.textColor
                          } bg-card p-3 rounded-lg shadow-md absolute font-medium overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${
                            hoveredItem === item.id ? "z-[100]" : "z-10"
                          }`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 1}%`,
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
                                    className={`border-2 ${item.borderColor} ${item.textColor} bg-transparent text-xs px-2 py-1 rounded-full font-medium`}
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
                          className={`border-2 ${item.borderColor} ${
                            item.color
                          } bg-opacity-30 text-white p-3 rounded-lg shadow-md absolute z-10 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${
                            hoveredItem === item.id ? "z-[100]" : "z-10"
                          }`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent - 1}%`,
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
                                    className={`${item.color} bg-opacity-30 text-white text-xs px-2 py-1 rounded-full font-medium`}
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
                          className={`border-2 py-2 px-2 ${item.borderColor} ${item.textColor} bg-card p-3 rounded-lg shadow-sm flex gap-2 font-medium items-center`}
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
                          className={`border-2 ${item.borderColor} ${item.color} bg-opacity-30 text-white p-3 rounded-lg shadow-sm flex gap-2 items-center`}
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
                        className={`${item.color} text-white p-3 rounded-lg shadow-lg absolute z-10 border-2 border-white/20 overflow-hidden`}
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent - 1}%`,
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
                        className={`border-2 px-2 py-2 ${item.borderColor} ${item.textColor} bg-card p-3 rounded-lg shadow-lg absolute z-10 font-medium overflow-hidden`}
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent - 1}%`,
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
                        className={`border-2 px-2 py-2 ${item.borderColor} ${item.color} bg-opacity-30 text-white p-3 rounded-lg shadow-lg absolute z-10 overflow-hidden`}
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent - 1}%`,
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
                          ? `border-2 ${item.borderColor} ${item.textColor} bg-transparent`
                          : `${item.color} text-white`
                      } text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1`}
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
                      className={`${event.color} text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1`}
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
