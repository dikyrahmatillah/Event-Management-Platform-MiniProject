"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  EventFormSchema,
  eventFormSchema,
} from "@/features/events/schemas/event.schema";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/atomic/form";
import { Input } from "@/components/ui/atomic/input";
import { Textarea } from "@/components/ui/atomic/textarea";
import { Button } from "@/components/ui/atomic/button";
import {
  CalendarIcon,
  CheckCircle,
  ArrowLeftIcon,
  TicketIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/atomic/popover";
import { Calendar } from "@/components/ui/atomic/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/atomic/separator";
import IDRCurrencyInput from "@/app/dashboard/organizer/events/idr";
import EventService from "@/lib/api/event-service";
import { toast } from "sonner";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const eventService = new EventService();

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: "",
      eventDescription: "",
      category: "",
      location: "",
      price: 0,
      totalSeats: 0,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(Number(eventId));

        // If event has image, set preview
        if (eventData.imageUrl) {
          setImagePreview(eventData.imageUrl);
        }

        // Map the API data structure to our form structure
        form.reset({
          eventName: eventData.eventName || "",
          eventDescription: eventData.description || "",
          category: eventData.category || "",
          location: eventData.location || "",
          price:
            typeof eventData.price === "string"
              ? parseInt(eventData.price) || 0
              : eventData.price || 0,
          totalSeats: eventData.totalSeats || 0,
          eventBanner: undefined, // Ensure eventBanner is undefined, not null or string
          startDate: eventData.startDate
            ? new Date(eventData.startDate)
            : undefined,
          endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
        });
      } catch (err) {
        console.error("Failed to fetch event data:", err);
        toast.error("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onSubmit = async (data: EventFormSchema) => {
    try {
      setIsSubmitting(true);

      // Convert form data to API structure
      const updateData = {
        eventName: data.eventName,
        description: data.eventDescription,
        category: data.category,
        location: data.location,
        price: data.price.toString(),
        totalSeats: data.totalSeats,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        // Add other fields as needed based on your API
      };

      // Update event
      await eventService.updateEvent(Number(eventId), updateData);

      // Show success message
      toast.success("Event updated successfully");

      // Navigate back to events list
      router.push("/dashboard/organizer/events");
    } catch (err) {
      console.error("Failed to update event:", err);
      toast.error("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    { label: "Edit Event", isActive: true },
  ];

  if (loading) {
    return (
      <DashboardPageLayout
        title="Edit Event"
        description="Update event information"
        breadcrumbs={breadcrumbs}
      >
        <div className="space-y-6 px-4 lg:px-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center py-8">
            <div className="animate-pulse flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2.5"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      title="Edit Event"
      description="Update event information"
      breadcrumbs={breadcrumbs}
    >
      <div className="px-4 lg:px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Banner Upload Section */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Event Banner</h2>
                    <p className="text-sm text-muted-foreground">
                      Upload an image to represent your event
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="eventBanner"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            {imagePreview ? (
                              <div className="relative w-full h-[200px] rounded-lg overflow-hidden border">
                                <Image
                                  src={imagePreview}
                                  alt="Event banner preview"
                                  fill
                                  className="object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    onChange(undefined);
                                    setImagePreview(null);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300 hover:border-gray-400 transition-colors">
                                <div className="flex flex-col items-center">
                                  <div className="p-3 rounded-full bg-gray-100 mb-2">
                                    <CalendarIcon className="h-6 w-6 text-gray-500" />
                                  </div>
                                  <p className="text-sm font-medium">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    SVG, PNG, JPG or GIF (Max 4MB)
                                  </p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        onChange(file);
                                        setImagePreview(
                                          URL.createObjectURL(file)
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Basic Info Section */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Basic Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Provide the essential details about your event
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                          <FormLabel>Event Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter event name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventDescription"
                      render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                          <FormLabel>Event Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your event, what attendees can expect, etc."
                              className="min-h-[120px] resize-y h-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Music, Technology, Food"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Event venue or address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Price (IDR)</FormLabel>
                            <FormControl>
                              <IDRCurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              Set the base event price (can be overridden by
                              ticket types)
                            </p>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="totalSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Seats</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Total available seats"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Schedule Section */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Event Schedule</h2>
                    <p className="text-sm text-muted-foreground">
                      When will your event take place?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a start date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick an end date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  const startDate = form.getValues("startDate");
                                  if (startDate && date && date < startDate) {
                                    form.setError("endDate", {
                                      type: "manual",
                                      message:
                                        "End date must be after start date",
                                    });
                                    return;
                                  }
                                  field.onChange(date);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Ticket Types Management Link */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium">Ticket Types</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage different ticket types, pricing, and capacity for
                      your event
                    </p>
                  </div>
                  <div className="border rounded-lg p-6 text-center bg-muted/20">
                    <p className="text-muted-foreground mb-4">
                      Ticket types are managed separately for better
                      organization
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/organizer/events/${eventId}/ticket-types`
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <TicketIcon className="h-4 w-4" />
                      Manage Ticket Types
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                    {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
