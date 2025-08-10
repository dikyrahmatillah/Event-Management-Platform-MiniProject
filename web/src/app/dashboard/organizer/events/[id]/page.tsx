"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/atomic/button";
import { Badge } from "@/components/ui/atomic/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Skeleton } from "@/components/ui/atomic/skeleton";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import {
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  UsersIcon,
  TicketIcon,
  EditIcon,
  ArrowLeftIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import EventService from "@/lib/api/event-service";
import { EventTypes } from "@/types/event.type";
import { ticketService } from "@/lib/api/ticket-service";
import { TicketTypes } from "@/types/ticket.types";
import { toast } from "sonner";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";

// Helper function to check valid date
function isValidDate(date: unknown) {
  if (!date) return false;
  const d = new Date(date as string);
  return d instanceof Date && !isNaN(d.getTime());
}

const eventService = new EventService();

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<EventTypes | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteEvent = async () => {
    if (!event) return;
    try {
      await eventService.deleteEvent(event.id, session?.user?.accessToken);
      toast.success(`Event "${event.eventName}" deleted successfully`);
      router.push("/dashboard/organizer/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    const fetchEventAndTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await eventService.getEventById(Number(params.id));
        setEvent(data);

        try {
          const token = session?.user?.accessToken;
          const ticketData = await ticketService.getTicketsByEventId(
            Number(params.id),
            token
          );
          setTicketTypes(ticketData);
        } catch (ticketError) {
          console.warn("Failed to fetch tickets:", ticketError);
          setTicketTypes([]);
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchEventAndTickets();
  }, [params.id, session?.user?.accessToken]);

  if (loading) {
    const breadcrumbs = [
      { label: "Organizer Dashboard", href: "/dashboard/organizer" },
      { label: "Events", href: "/dashboard/organizer/events" },
      { label: "Event Details", isActive: true },
    ];

    return (
      <DashboardPageLayout
        title="Event Details"
        description="View and manage event information"
        breadcrumbs={breadcrumbs}
      >
        <div className="space-y-6 px-4 lg:px-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardPageLayout>
    );
  }

  if (error) {
    const breadcrumbs = [
      { label: "Organizer Dashboard", href: "/dashboard/organizer" },
      { label: "Events", href: "/dashboard/organizer/events" },
      { label: "Event Details", isActive: true },
    ];

    return (
      <DashboardPageLayout
        title="Event Details"
        description="View and manage event information"
        breadcrumbs={breadcrumbs}
      >
        <div className="px-4 lg:px-6">
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-destructive text-lg font-semibold mb-2">
                {error}
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </DashboardPageLayout>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
        <span className="text-lg font-semibold mb-2">Event not found.</span>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          Back
        </Button>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    { label: event?.eventName || "Event Details", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title={event?.eventName || "Event Details"}
      description="View and manage event information"
      breadcrumbs={breadcrumbs}
    >
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
                    variant={
                      event.status === "ACTIVE" ? "default" : "secondary"
                    }
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
                    <span className="italic text-muted-foreground">
                      No name
                    </span>
                  )}
                </CardTitle>

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
                    {event.location || (
                      <span className="italic">No location</span>
                    )}
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
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Description Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">About this event</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {event.description || (
                  <span className="italic">No description provided</span>
                )}
              </div>
            </div>

            {/* Ticket Types Section */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <TicketIcon className="h-4 w-4" />
                Ticket Types
              </h3>

              {ticketTypes.length === 0 ? (
                <div className="bg-muted/40 rounded-lg p-6 text-center">
                  <TicketIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
                  <p className="text-sm font-medium">
                    No ticket types available
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">{ticket.typeName}</div>
                          {ticket.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {ticket.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary" className="font-semibold">
                            IDR {Number(ticket.price).toLocaleString()}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {ticket.availableQuantity} of {ticket.quantity}{" "}
                            available
                          </div>

                          <div className="w-32 bg-muted rounded-full h-1.5 mt-1">
                            <div
                              className="bg-primary rounded-full h-1.5"
                              style={{
                                width: `${
                                  ((ticket.quantity -
                                    ticket.availableQuantity) /
                                    ticket.quantity) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center  justify-around border-t pt-6 mt-6">
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
                <Link
                  href={`/dashboard/organizer/events/${event.id}/attendees`}
                >
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
                  onClick={() => setDeleteDialogOpen(true)}
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
                  onConfirm={handleDeleteEvent}
                  loading={loading}
                  confirmClassName="bg-red-600 hover:bg-red-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
