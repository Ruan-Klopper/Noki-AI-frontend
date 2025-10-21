import {
  TimetableService,
  Timetable,
  TimetableEvent,
  ApiResponse,
} from "../types";
import { HttpClient } from "../http";

// Timetable Service implementation following Single Responsibility Principle
export class TimetableServiceImpl implements TimetableService {
  readonly baseUrl = "/timetable";
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getTimetable(): Promise<ApiResponse<Timetable>> {
    return this.httpClient.get<Timetable>(this.baseUrl);
  }

  async updateTimetable(
    data: Partial<Timetable>
  ): Promise<ApiResponse<Timetable>> {
    return this.httpClient.patch<Timetable>(this.baseUrl, data);
  }

  async addEvent(event: TimetableEvent): Promise<ApiResponse<TimetableEvent>> {
    return this.httpClient.post<TimetableEvent>(
      `${this.baseUrl}/events`,
      event
    );
  }

  async updateEvent(
    id: string,
    event: Partial<TimetableEvent>
  ): Promise<ApiResponse<TimetableEvent>> {
    return this.httpClient.patch<TimetableEvent>(
      `${this.baseUrl}/events/${id}`,
      event
    );
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/events/${id}`);
  }

  async getEventsByDay(
    dayOfWeek: number
  ): Promise<ApiResponse<TimetableEvent[]>> {
    return this.httpClient.get<TimetableEvent[]>(
      `${this.baseUrl}/events/day/${dayOfWeek}`
    );
  }

  async getEventsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<TimetableEvent[]>> {
    return this.httpClient.get<TimetableEvent[]>(
      `${this.baseUrl}/events/range`,
      {
        startDate,
        endDate,
      }
    );
  }

  async duplicateEvent(id: string): Promise<ApiResponse<TimetableEvent>> {
    return this.httpClient.post<TimetableEvent>(
      `${this.baseUrl}/events/${id}/duplicate`
    );
  }
}
