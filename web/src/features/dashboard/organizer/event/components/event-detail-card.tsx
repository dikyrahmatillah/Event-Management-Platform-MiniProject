import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/atomic/button";
import { Badge } from "@/components/ui/atomic/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/atomic/card";
import {
  CalendarIcon,
  TicketIcon,
  EditIcon,
  ArrowLeftIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";
import { EventTypes } from "@/types/event.type";
import { TicketTypes } from "@/types/ticket.types";
import { EventMeta } from "@/features/dashboard/organizer/event/components/event-meta";
import { TicketTypeList } from "@/features/dashboard/organizer/event/components/ticket-type-list";

export function EventDetailCard({
  event,
  ticketTypes,
  onDelete,
  deleteDialogOpen,
  setDeleteDialogOpen,
  onConfirmDelete,
  loading,
}: {
  event: EventTypes;
  ticketTypes: TicketTypes[];
  onDelete: () => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onConfirmDelete: () => void;
  loading: boolean;
}) {
  const router = useRouter();

  return (
    <div className="px-4 lg:px-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-4">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.eventName || "Event image"}
                  width={1200}
                  height={320}
                  className="rounded-lg object-cover border shadow-sm w-full h-[160px] md:h-[240px]"
                />
              ) : (
                <div className="w-full h-[160px] md:h-[240px] bg-muted rounded-lg flex items-center justify-center border shadow-sm">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
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
                  {event.status || "Unknown"}
                </Badge>
                {event.category && (
                  <Badge variant="outline" className="text-xs">
                    {event.category}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {event.eventName || (
                  <span className="italic text-muted-foreground">No name</span>
                )}
              </CardTitle>
              <EventMeta event={event} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">About this event</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {event.description || (
                <span className="italic">No description provided</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <TicketIcon className="h-4 w-4" />
              Ticket Types
            </h3>
            <TicketTypeList ticketTypes={ticketTypes} />
          </div>
          <div className="flex flex-wrap items-center justify-around border-t pt-6 mt-6">
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <Link
                href={`/dashboard/organizer/events/${event.id}/ticket-types`}
              >
                <Button
                  variant="default"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TicketIcon className="h-4 w-4" />
                  Manage Tickets
                </Button>
              </Link>
              <Link href={`/dashboard/organizer/events/${event.id}/attendees`}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UsersIcon className="h-4 w-4" />
                  View Attendees
                </Button>
              </Link>
              <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <EditIcon className="h-4 w-4" />
                  Edit Event
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
                onClick={onDelete}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete Event
              </Button>
              <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Event"
                description={`Are you sure you want to delete the event "${event.eventName}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={onConfirmDelete}
                loading={loading}
                confirmClassName="bg-red-600 hover:bg-red-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
