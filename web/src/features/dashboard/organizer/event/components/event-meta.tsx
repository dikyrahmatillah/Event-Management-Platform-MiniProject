import React from "react";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CreditCardIcon,
} from "lucide-react";
import { format } from "date-fns";
import { EventTypes } from "@/types/event.type";

function isValidDate(date: unknown) {
  if (!date) return false;
  const d = new Date(date as string);
  return d instanceof Date && !isNaN(d.getTime());
}

export function EventMeta({ event }: { event: EventTypes }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        {isValidDate(event.startDate) ? (
          format(new Date(event.startDate as string), "PPP 'at' p")
        ) : (
          <span className="italic">Not specified</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-4 w-4" />
        {event.location || <span className="italic">No location</span>}
      </div>
      <div className="flex items-center gap-2">
        <UsersIcon className="h-4 w-4" />
        {typeof event.availableSeats === "number" &&
        typeof event.totalSeats === "number" ? (
          `${event.availableSeats} / ${event.totalSeats} seats`
        ) : (
          <span className="italic">No seats info</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <CreditCardIcon className="h-4 w-4" />
        {event.price
          ? `IDR ${parseInt(event.price).toLocaleString()}`
          : "Free event"}
      </div>
    </div>
  );
}
