"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  EventFormSchema,
  eventFormSchema,
} from "@/features/events/schemas/event.schema";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/atomic/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/atomic/button";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/atomic/separator";
import IDRCurrencyInput from "@/app/dashboard/events/idr";

// Dummy fetch function, replace with real API call
async function fetchEventById(id: string) {
  // TODO: Replace with real API call
  // Example response structure:
  return {
    eventBanner: null, // or image url
    eventName: "Sample Event",
    eventDescription: "This is a sample event description.",
    startDate: new Date(),
    endDate: new Date(),
    ticketTypes: [
      { type: "Pre Sale", price: 50000, availableSeat: 100 },
      { type: "Regular", price: 100000, availableSeat: 200 },
    ],
  };
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useSearchParams();
  const eventId = params.get("id");

  const ticketTypeOptions = [
    { id: "Pre Sale", label: "Pre Sale" },
    { id: "Regular", label: "Regular" },
    { id: "VIP", label: "VIP" },
  ];

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ticketTypes: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchEventById(eventId).then((data) => {
      // If eventBanner is a URL, set preview
      if (data.eventBanner && typeof data.eventBanner === "string") {
        setImagePreview(data.eventBanner);
      }
      form.reset({
        ...data,
        eventBanner: undefined, // Ensure eventBanner is undefined, not null or string
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        ticketTypes: (data.ticketTypes || []).map((t) => ({
          ...t,
          type: t.type as "Pre Sale" | "Regular" | "VIP",
        })),
      });
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onSubmit = (data: EventFormSchema) => {
    setIsSubmitting(true);
    // TODO: Replace with real API update call
    setTimeout(() => {
      console.log("Update event:", data);
      setIsSubmitting(false);
      router.push("/dashboard/events");
    }, 1500);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading event data...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground mt-1">
            Update the details for your event
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/events")}
        >
          Cancel
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                render={({ field: { onChange, ...field } }) => (
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
                                    setImagePreview(URL.createObjectURL(file));
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              const startDate = form.getValues("startDate");
                              if (startDate && date && date < startDate) {
                                form.setError("endDate", {
                                  type: "manual",
                                  message: "End date must be after start date",
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

            {/* Pricing and Capacity (per ticket type) */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">
                  Ticket Types, Pricing & Capacity
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select ticket types and set price & available seats for each
                </p>
              </div>
              {/* Ticket type checkboxes */}
              <div className="bg-white border rounded-md p-3 flex flex-col gap-2 mb-4">
                {ticketTypeOptions.map((type) => {
                  const selected = form
                    .watch("ticketTypes")
                    .some((t) => t.type === type.id);
                  return (
                    <label
                      key={type.id}
                      className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 focus:ring-2 focus:ring-primary"
                        checked={selected}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const current = form.getValues("ticketTypes") || [];
                          if (checked) {
                            form.setValue("ticketTypes", [
                              ...current,
                              {
                                type: type.id as "Pre Sale" | "Regular" | "VIP",
                                price: 0,
                                availableSeat: 1,
                              },
                            ]);
                          } else {
                            form.setValue(
                              "ticketTypes",
                              current.filter((t) => t.type !== type.id)
                            );
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  );
                })}
              </div>
              {/* Per-ticket-type price & seat fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {form.watch("ticketTypes").map((ticket, idx) => (
                  <div
                    key={ticket.type}
                    className="border rounded-md p-4 flex flex-col gap-3 bg-gray-50"
                  >
                    <div className="font-semibold mb-1">{ticket.type}</div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Price (IDR)
                        </label>
                        <IDRCurrencyInput
                          value={ticket.price}
                          onChange={(val: number) => {
                            const updated = [...form.getValues("ticketTypes")];
                            updated[idx].price = val;
                            form.setValue("ticketTypes", updated);
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          Set to 0 for free
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Available Seats
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={ticket.availableSeat}
                          onChange={(e) => {
                            const updated = [...form.getValues("ticketTypes")];
                            updated[idx].availableSeat = Number(e.target.value);
                            form.setValue("ticketTypes", updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {form.watch("ticketTypes").length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Select at least one ticket type above.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t">
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
  );
}
