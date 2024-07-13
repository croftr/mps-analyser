"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react"
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomDatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: Date; // Make date optional
  onDateChange: (date: Date) => void; // Renamed to onDateChange
}

export default function CustomDatePicker({
  className,
  date,
  onDateChange, // Use the renamed prop
}: CustomDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState(date || startOfDay(new Date()));

  const handleDateChange = (newDate: Date = new Date()) => {
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "LLL dd, y")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            className="bg-background"
            initialFocus
            mode="single" // Changed to 'single' for single date selection
            defaultMonth={selectedDate}
            selected={selectedDate}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
