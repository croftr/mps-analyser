"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format, startOfDay, addDays } from "date-fns";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomDateRangePickerProps {
  className?: string
  from: Date | undefined;
  to: Date | undefined;
  onChange: (date: DateRange | undefined) => void;
}

export default function CustomDateRangePicker({
  className,
  from,
  to,
  onChange,
}: CustomDateRangePickerProps) {

  const today = startOfDay(new Date()); 
  const tomorrow = addDays(today, 1); 

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from || today,
    to: to || tomorrow,
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onChange(newDate);
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            className="bg-background"
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}            
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
