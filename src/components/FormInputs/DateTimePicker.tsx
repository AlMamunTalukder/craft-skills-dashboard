 

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, setHours, setMinutes } from "date-fns";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  defaultValue?: Date;
}

export function DateTimePickerForm({ name, label, defaultValue }: Props) {
  const { control } = useFormContext();

  // Function to update date parts (hour, minute, ampm)
  const handleTimeChange = (
    date: Date,
    type: "hour" | "minute" | "ampm",
    value: string,
  ) => {
    if (!date) return date;

    let updatedDate = new Date(date);
    const currentHours = date.getHours();

    switch (type) {
      case "hour": {
        const parsedHour = parseInt(value);
        const newHour =
          currentHours >= 12 ? (parsedHour % 12) + 12 : parsedHour % 12;
        updatedDate = setHours(date, newHour);
        break;
      }
      case "minute": {
        updatedDate = setMinutes(date, parseInt(value));
        break;
      }
      case "ampm": {
        const isPM = value === "PM";
        const currentHour = currentHours % 12;
        updatedDate = setHours(date, isPM ? currentHour + 12 : currentHour);
        break;
      }
    }

    return updatedDate;
  };

  const getFormattedDate = (date: Date | null) => {
    if (!date) return "";
    try {
      return format(date, "MM/dd/yyyy hh:mm aa");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {getFormattedDate(field.value) || (
                    <span>Pick a date and time</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve the current time when selecting a new date
                      const currentTime = field.value || new Date();
                      date.setHours(currentTime.getHours());
                      date.setMinutes(currentTime.getMinutes());
                      field.onChange(date);
                    }
                  }}
                  initialFocus
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  {/* Hours */}
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={
                              field.value &&
                              field.value.getHours() % 12 === hour % 12
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              const newDate = handleTimeChange(
                                field.value || new Date(),
                                "hour",
                                hour.toString(),
                              );
                              field.onChange(newDate);
                            }}
                          >
                            {hour}
                          </Button>
                        ),
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>

                  {/* Minutes */}
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(
                        (minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              field.value && field.value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              const newDate = handleTimeChange(
                                field.value || new Date(),
                                "minute",
                                minute.toString(),
                              );
                              field.onChange(newDate);
                            }}
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ),
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>

                  {/* AM/PM */}
                  <ScrollArea>
                    <div className="flex sm:flex-col p-2">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            field.value &&
                            ((ampm === "AM" && field.value.getHours() < 12) ||
                              (ampm === "PM" && field.value.getHours() >= 12))
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => {
                            const newDate = handleTimeChange(
                              field.value || new Date(),
                              "ampm",
                              ampm,
                            );
                            field.onChange(newDate);
                          }}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage>{error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
