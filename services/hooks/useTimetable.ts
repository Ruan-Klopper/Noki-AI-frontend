import { useState, useEffect, useCallback } from "react";
import {
  TimetableService,
  Timetable,
  TimetableEvent,
  ApiResponse,
} from "../types";
import { getTimetableService } from "../index";

// Timetable hook for managing timetable state
export const useTimetable = () => {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const timetableService = getTimetableService();

  const fetchTimetable = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await timetableService.getTimetable();
      if (response.success) {
        setTimetable(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch timetable"
      );
    } finally {
      setIsLoading(false);
    }
  }, [timetableService]);

  const addEvent = useCallback(
    async (event: TimetableEvent): Promise<TimetableEvent | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await timetableService.addEvent(event);
        if (response.success) {
          setTimetable((prev) =>
            prev
              ? {
                  ...prev,
                  events: [...prev.events, response.data],
                }
              : null
          );
          return response.data;
        }
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add event");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [timetableService]
  );

  const updateEvent = useCallback(
    async (
      id: string,
      event: Partial<TimetableEvent>
    ): Promise<TimetableEvent | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await timetableService.updateEvent(id, event);
        if (response.success) {
          setTimetable((prev) =>
            prev
              ? {
                  ...prev,
                  events: prev.events.map((e) =>
                    e.id === id ? response.data : e
                  ),
                }
              : null
          );
          return response.data;
        }
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update event");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [timetableService]
  );

  const deleteEvent = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await timetableService.deleteEvent(id);
        if (response.success) {
          setTimetable((prev) =>
            prev
              ? {
                  ...prev,
                  events: prev.events.filter((e) => e.id !== id),
                }
              : null
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete event");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [timetableService]
  );

  const getEventsByDay = useCallback(
    async (dayOfWeek: number): Promise<TimetableEvent[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await timetableService.getEventsByDay(dayOfWeek);
        if (response.success) {
          return response.data;
        }
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [timetableService]
  );

  const getEventsByDateRange = useCallback(
    async (startDate: string, endDate: string): Promise<TimetableEvent[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await timetableService.getEventsByDateRange(
          startDate,
          endDate
        );
        if (response.success) {
          return response.data;
        }
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [timetableService]
  );

  // Load timetable on mount
  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return {
    timetable,
    isLoading,
    error,
    fetchTimetable,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDay,
    getEventsByDateRange,
    setError,
  };
};
