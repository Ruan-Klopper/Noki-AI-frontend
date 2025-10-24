/**
 * Global Timezone Configuration
 *
 * This file defines the application's timezone settings.
 * All date/time conversions should reference this configuration.
 */

export const TIMEZONE_CONFIG = {
  /**
   * Timezone offset in hours from UTC
   * UTC+2:00 = South African Standard Time (SAST)
   */
  OFFSET_HOURS: 2,

  /**
   * Timezone offset in minutes from UTC
   */
  OFFSET_MINUTES: 2 * 60,

  /**
   * Timezone string representation
   */
  TIMEZONE_STRING: "UTC+2:00",

  /**
   * IANA timezone identifier
   */
  TIMEZONE_ID: "Africa/Johannesburg",
} as const;

/**
 * Convert a UTC date string to local date string (YYYY-MM-DD) in the configured timezone
 * @param utcDateString - ISO date string in UTC (e.g., "2025-10-24T07:00:00.000Z")
 * @returns Date string in YYYY-MM-DD format adjusted for timezone
 */
export function utcToLocalDateString(utcDateString: string): string {
  if (!utcDateString) return "";

  const date = new Date(utcDateString);
  // Add timezone offset to get local time
  const localTime = date.getTime() + TIMEZONE_CONFIG.OFFSET_MINUTES * 60 * 1000;
  const localDate = new Date(localTime);

  const year = localDate.getUTCFullYear();
  const month = (localDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = localDate.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Convert a UTC date string to local time string (HH:MM) in the configured timezone
 * @param utcDateString - ISO date string in UTC (e.g., "2025-10-24T07:00:00.000Z")
 * @returns Time string in HH:MM format adjusted for timezone
 */
export function utcToLocalTimeString(utcDateString: string): string {
  if (!utcDateString) return "";

  const date = new Date(utcDateString);
  // Add timezone offset to get local time
  const localTime = date.getTime() + TIMEZONE_CONFIG.OFFSET_MINUTES * 60 * 1000;
  const localDate = new Date(localTime);

  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Convert a local Date object to a date string (YYYY-MM-DD)
 * @param date - JavaScript Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function dateToLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Add hours to a time string (handles 24-hour wrap-around)
 * @param timeString - Time in HH:MM format
 * @param hours - Number of hours to add
 * @returns New time string in HH:MM format
 */
export function addHoursToTime(timeString: string, hours: number): string {
  if (!timeString) return "";

  const [h, m] = timeString.split(":").map(Number);
  const newHours = (h + hours) % 24;

  return `${newHours.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
}
