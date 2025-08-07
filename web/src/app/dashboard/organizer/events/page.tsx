"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, PlusCircle, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { Button } from "@/components/ui/atomic/button";
import { Input } from "@/components/ui/atomic/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atomic/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/atomic/alert-dialog";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { EventTypes } from "@/types/event.type";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import EventService from "@/lib/api/event-service";
const eventService = new EventService();

export default function EventsManagementPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const response = await eventService.getAllEventsByOrganizer(
          Number(session.user.id)
        );
        setEvents(response);
        setFilteredEvents(response);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [session?.user?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...events];

      if (debouncedSearchTerm) {
        filtered = filtered.filter(
          (event) =>
            event.eventName
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            event.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            event.location
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    };

    applyFilters();
  }, [events, debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title="Events Management"
      description="Create, edit and manage your events"
      breadcrumbs={breadcrumbs}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Events
              </p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Events
              </p>
              <p className="text-2xl font-bold text-green-600">
                {events.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Seats
              </p>
              <p className="text-2xl font-bold">
                {events.reduce((sum, event) => sum + event.totalSeats, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Available Seats
              </p>
              <p className="text-2xl font-bold">
                {events.reduce((sum, event) => sum + event.availableSeats, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" className="cursor-pointer">
                All Events
              </TabsTrigger>
              <TabsTrigger value="active" className="cursor-pointer">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="cursor-pointer">
                Inactive
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="cursor-pointer">
                Cancelled
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-8 w-full md:w-[150px] lg:w-[250px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Link href="/dashboard/organizer/events/create">
                <Button className="cursor-pointer">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
          </div>

          <TabsContent value="all">
            <EventsTable
              events={filteredEvents}
              isLoading={isLoading}
              error={error}
              setEvents={setEvents}
              setFilteredEvents={setFilteredEvents}
            />
          </TabsContent>

          <TabsContent value="active">
            <EventsTable
              events={events.filter((e) => e.status === "ACTIVE")}
              isLoading={isLoading}
              error={error}
              setEvents={setEvents}
              setFilteredEvents={setFilteredEvents}
            />
          </TabsContent>

          <TabsContent value="inactive">
            <EventsTable
              events={events.filter((e) => e.status === "INACTIVE")}
              isLoading={isLoading}
              error={error}
              setEvents={setEvents}
              setFilteredEvents={setFilteredEvents}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <EventsTable
              events={events.filter((e) => e.status === "CANCELLED")}
              isLoading={isLoading}
              error={error}
              setEvents={setEvents}
              setFilteredEvents={setFilteredEvents}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}

function EventsTable({
  events,
  isLoading,
  error,
  setEvents,
  setFilteredEvents,
}: {
  events: EventTypes[];
  isLoading: boolean;
  error: string | null;
  setEvents: React.Dispatch<React.SetStateAction<EventTypes[]>>;
  setFilteredEvents: React.Dispatch<React.SetStateAction<EventTypes[]>>;
}) {
  const { data: session } = useSession();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    eventId: number | null;
    eventName: string;
  }>({
    isOpen: false,
    eventId: null,
    eventName: "",
  });

  const handleDeleteEvent = async () => {
    if (!deleteDialog.eventId) return;

    try {
      await eventService.deleteEvent(
        deleteDialog.eventId,
        session?.user?.accessToken
      );
      toast.success(`Event "${deleteDialog.eventName}" deleted successfully`);

      // Update both events arrays
      setEvents((prev) => prev.filter((e) => e.id !== deleteDialog.eventId));
      setFilteredEvents((prev) =>
        prev.filter((e) => e.id !== deleteDialog.eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeleteDialog({ isOpen: false, eventId: null, eventName: "" });
    }
  };

  const openDeleteDialog = (eventId: number, eventName: string) => {
    setDeleteDialog({
      isOpen: true,
      eventId,
      eventName,
    });
  };
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex justify-center items-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No events found
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first event to get started
          </p>
          <Link href="/dashboard/organizer/events/create">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Event
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-muted/50">
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
                      <p className="text-xs text-muted-foreground">
                        {event.category}
                      </p>
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
                    {event.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        openDeleteDialog(event.id, event.eventName)
                      }
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setDeleteDialog({ isOpen: false, eventId: null, eventName: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.eventName}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
