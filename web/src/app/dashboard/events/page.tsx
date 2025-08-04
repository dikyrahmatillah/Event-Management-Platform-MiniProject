"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, PlusCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { Button } from "@/components/ui/atomic/button";
import { Input } from "@/components/ui/atomic/input";
import { Select } from "@/components/ui/atomic/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atomic/tabs";
import { EventTypes } from "@/types/event.types";
import { format } from "date-fns";

// Import the event service for fetching data
import EventService from "@/lib/api/event-service";
const eventService = new EventService();

export default function EventsManagementPage() {
  // State for events data
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Categories derived from events data
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getAllEvents();
        setEvents(data);
        setFilteredEvents(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((event) => event.category))
        ).filter(Boolean);
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters when search term or filters change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...events];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (event) =>
            event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply category filter
      if (categoryFilter && categoryFilter !== "all") {
        filtered = filtered.filter(
          (event) => event.category === categoryFilter
        );
      }

      setFilteredEvents(filtered);
    };

    applyFilters();
  }, [events, searchTerm, categoryFilter]);

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <p className="text-muted-foreground">
            Create, edit and manage your events
          </p>
        </div>
        <Link href="/dashboard/events/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Event Stats Summary Cards */}
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Events
          </h3>
          <p className="text-2xl font-bold">{events.length}</p>
        </Card>
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Events
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {events.filter((e) => e.status === "ACTIVE").length}
          </p>
        </Card>
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Seats
          </h3>
          <p className="text-2xl font-bold">
            {events.reduce((sum, event) => sum + event.totalSeats, 0)}
          </p>
        </Card>
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Available Seats
          </h3>
          <p className="text-2xl font-bold">
            {events.reduce((sum, event) => sum + event.availableSeats, 0)}
          </p>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <EventsTable
            events={filteredEvents}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="active">
          <EventsTable
            events={events.filter((e) => e.status === "ACTIVE")}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <EventsTable
            events={events.filter((e) => e.status === "INACTIVE")}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="cancelled">
          <EventsTable
            events={events.filter((e) => e.status === "CANCELLED")}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// EventsTable component for displaying events in a table format
function EventsTable({
  events,
  isLoading,
  error,
}: {
  events: EventTypes[];
  isLoading: boolean;
  error: string | null;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-40 border border-dashed rounded-md">
        <p className="text-muted-foreground mb-4">No events found</p>
        <Link href="/dashboard/events/create">
          <Button variant="outline">Create your first event</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-3 px-4 font-medium">Event</th>
            <th className="py-3 px-4 font-medium">Date</th>
            <th className="py-3 px-4 font-medium">Location</th>
            <th className="py-3 px-4 font-medium">Price (IDR)</th>
            <th className="py-3 px-4 font-medium">Seats</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b hover:bg-slate-50">
              <td className="py-3 px-4">
                <div className="flex items-start gap-3">
                  {event.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={event.eventName}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-slate-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{event.eventName}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.category}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm">
                    {format(new Date(event.startDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    to {format(new Date(event.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm">{event.location}</p>
              </td>
              <td className="py-3 px-4">
                <p className="font-medium">
                  {parseInt(event.price).toLocaleString()}
                </p>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm">
                    {event.availableSeats} / {event.totalSeats}
                  </p>
                  <div className="w-24 bg-slate-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.round(
                          (event.availableSeats / event.totalSeats) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={
                    event.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : event.status === "INACTIVE"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {event.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
