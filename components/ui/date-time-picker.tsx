"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  isAllDay?: boolean;
  onAllDayChange?: (isAllDay: boolean) => void;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  className,
  isAllDay = false,
  onAllDayChange,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  const [hours, setHours] = React.useState(value ? value.getHours() : 12);
  const [minutes, setMinutes] = React.useState(value ? value.getMinutes() : 0);
  const [allDay, setAllDay] = React.useState(isAllDay);

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setHours(value.getHours());
      setMinutes(value.getMinutes());
    }
  }, [value]);

  React.useEffect(() => {
    setAllDay(isAllDay);
  }, [isAllDay]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (allDay) {
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
      }
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours);
    setMinutes(newMinutes);

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(newHours);
      newDate.setMinutes(newMinutes);
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const handleAllDayToggle = () => {
    const newAllDay = !allDay;
    setAllDay(newAllDay);
    onAllDayChange?.(newAllDay);

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (newAllDay) {
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
      }
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setHours(12);
    setMinutes(0);
    setAllDay(false);
    onChange(undefined);
    onAllDayChange?.(false);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-left flex items-center justify-between hover:border-noki-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-noki-primary text-sm",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon size={14} className="flex-shrink-0" />
            {selectedDate ? (
              <span className="flex items-center gap-2">
                {format(selectedDate, "PPP")}
                {allDay ? (
                  <span className="text-xs bg-noki-primary/20 text-noki-primary px-2 py-0.5 rounded">
                    All Day
                  </span>
                ) : (
                  <>
                    <Clock size={14} className="flex-shrink-0" />
                    {format(selectedDate, "HH:mm")}
                  </>
                )}
              </span>
            ) : (
              placeholder
            )}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-0">
          {/* Calendar on the left */}
          <div className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>

          {/* Time controls on the right */}
          <div className="border-l border-border p-3 space-y-3 min-w-[200px]">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-medium">
                Options
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={handleAllDayToggle}
                  className="w-4 h-4 rounded border-border text-noki-primary focus:ring-2 focus:ring-noki-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-foreground">
                  All Day
                </span>
              </label>
            </div>

            {!allDay && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Time
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Hours
                    </label>
                    <select
                      value={hours}
                      onChange={(e) =>
                        handleTimeChange(
                          Number.parseInt(e.target.value),
                          minutes
                        )
                      }
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-noki-primary"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Minutes
                    </label>
                    <select
                      value={minutes}
                      onChange={(e) =>
                        handleTimeChange(hours, Number.parseInt(e.target.value))
                      }
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-noki-primary"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-3 rounded-lg bg-noki-primary text-white text-sm font-medium hover:bg-noki-primary/90 transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleClear}
                className="w-full py-2 px-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
