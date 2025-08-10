"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import { Input } from "@/components/ui/atomic/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atomic/tabs";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { useEvents } from "@/features/dashboard/organizer/event/hooks/useEvents";
import { EventsTable } from "@/features/dashboard/organizer/event/components/events-table";
import EventService from "@/lib/api/event-service";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const TABS = [
  { value: "all", label: "All Events" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "cancelled", label: "Cancelled" },
];

const eventService = new EventService();

export default function EventsManagementPage() {
  const { data: session } = useSession();
  const { events, setEvents, isLoading, error } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    if (tab !== "all")
      filtered = filtered.filter((e) => e.status === tab.toUpperCase());
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
    return filtered;
  }, [events, tab, debouncedSearchTerm]);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await eventService.deleteEvent(eventId, session?.user?.accessToken);
      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      toast.error("Failed to delete event. Please try again.");
    }
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
          <p className="text-sm font-medium text-muted-foreground">
            Total Events
          </p>
          <p className="text-2xl font-bold">{events.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Active Events
          </p>
          <p className="text-2xl font-bold text-green-600">
            {events.filter((e) => e.status === "ACTIVE").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total Seats
          </p>
          <p className="text-2xl font-bold">
            {events.reduce((sum, e) => sum + e.totalSeats, 0)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Available Seats
          </p>
          <p className="text-2xl font-bold">
            {events.reduce((sum, e) => sum + e.availableSeats, 0)}
          </p>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-6">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="cursor-pointer"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-8 w-full md:w-[150px] lg:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
          <TabsContent value={tab}>
            <EventsTable
              events={filteredEvents}
              isLoading={isLoading}
              error={error}
              onDelete={handleDeleteEvent}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
}
