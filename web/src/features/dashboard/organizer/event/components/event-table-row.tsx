import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/atomic/badge";
import { Button } from "@/components/ui/atomic/button";
import { EventTypes } from "@/types/event.type";

interface EventTableRowProps {
  event: EventTypes;
  onDeleteClick: (eventId: number, eventName: string) => void;
}

export function EventTableRow({ event, onDeleteClick }: EventTableRowProps) {
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {event.imageUrl ? (
            <div className="relative w-10 h-10 rounded-md overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.eventName}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <Link
              href={`/dashboard/organizer/events/${event.id}`}
              className="font-medium hover:underline"
            >
              {event.eventName}
            </Link>
            <p className="text-xs text-muted-foreground">{event.category}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm">
          {format(new Date(event.startDate), "MMM dd, yyyy")}
        </span>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant={event.status === "ACTIVE" ? "default" : "secondary"}
          className={
            event.status === "ACTIVE"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : event.status === "INACTIVE"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }
        >
          {event.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteClick(event.id, event.eventName)}
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
