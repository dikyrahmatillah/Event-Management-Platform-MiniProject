"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import IDRCurrencyInput from "@/app/dashboard/organizer/events/idr";
import EventService from "@/lib/api/event-service";
import { ticketService } from "@/lib/api/ticket-service";
import { toast } from "sonner";
import { EventTypes } from "@/types/event.types";
import { TicketTypes } from "@/types/ticket.types";

// Schema for ticket type form
const ticketTypeSchema = z.object({
  typeName: z.string().min(1, "Ticket type name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

type TicketTypeFormData = z.infer<typeof ticketTypeSchema>;

export default function TicketTypesPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const eventService = new EventService();

  const [event, setEvent] = useState<EventTypes | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketTypes | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<TicketTypeFormData>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
      price: 0,
      quantity: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(Number(eventId));
        setEvent(eventData);

        const ticketData = await ticketService.getTicketsByEventId(
          Number(eventId)
        );
        setTicketTypes(ticketData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch event data.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onSubmit = async (data: TicketTypeFormData) => {
    try {
      setIsSubmitting(true);

      const ticketData = {
        eventId: Number(eventId),
        typeName: data.typeName,
        description: data.description || "",
        price: data.price.toString(),
        quantity: data.quantity,
        availableQuantity: data.quantity,
      };

      if (editingTicket) {
        // Update existing ticket type
        await ticketService.updateTicketType(editingTicket.id, ticketData);
        toast.success("Ticket type updated successfully");
      } else {
        // Create new ticket type
        await ticketService.createTicketType(ticketData);
        toast.success("Ticket type created successfully");
      }

      // Refresh ticket types
      const updatedTickets = await ticketService.getTicketsByEventId(
        Number(eventId)
      );
      setTicketTypes(updatedTickets);

      // Reset form
      form.reset();
      setEditingTicket(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save ticket type:", error);
      toast.error("Failed to save ticket type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ticket: TicketTypes) => {
    setEditingTicket(ticket);
    form.reset({
      typeName: ticket.typeName,
      description: ticket.description || "",
      price:
        typeof ticket.price === "string"
          ? parseInt(ticket.price)
          : ticket.price,
      quantity: ticket.quantity,
    });
    setShowForm(true);
  };

  const handleDelete = async (ticketId: number) => {
    if (!confirm("Are you sure you want to delete this ticket type?")) return;

    try {
      await ticketService.deleteTicketType(ticketId);
      toast.success("Ticket type deleted successfully");

      // Refresh ticket types
      const updatedTickets = await ticketService.getTicketsByEventId(
        Number(eventId)
      );
      setTicketTypes(updatedTickets);
    } catch (error) {
      console.error("Failed to delete ticket type:", error);
      toast.error("Failed to delete ticket type. Please try again.");
    }
  };

  const handleCancelForm = () => {
    form.reset();
    setEditingTicket(null);
    setShowForm(false);
  };

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    {
      label: event?.eventName || "Event",
      href: `/dashboard/organizer/events/${eventId}`,
    },
    { label: "Ticket Types", isActive: true },
  ];

  if (loading) {
    return (
      <DashboardPageLayout
        title="Manage Ticket Types"
        description="Create and manage ticket types for your event"
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
      title="Manage Ticket Types"
      description={`Create and manage ticket types for ${
        event?.eventName || "your event"
      }`}
      breadcrumbs={breadcrumbs}
    >
      <div className="px-4 lg:px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Event
          </Button>

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" /> Add Ticket Type
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Add/Edit Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTicket ? "Edit Ticket Type" : "Add New Ticket Type"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="typeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticket Type Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., General Admission, VIP, Early Bird"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Number of tickets available"
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

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (IDR)</FormLabel>
                          <FormControl>
                            <IDRCurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Set to 0 for free tickets
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what's included with this ticket type..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelForm}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                          ? editingTicket
                            ? "Updating..."
                            : "Creating..."
                          : editingTicket
                          ? "Update Ticket Type"
                          : "Create Ticket Type"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Existing Ticket Types */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Ticket Types</CardTitle>
            </CardHeader>
            <CardContent>
              {ticketTypes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No ticket types created yet
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" /> Create Your First Ticket
                    Type
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{ticket.typeName}</h3>
                          <Badge variant="secondary">
                            IDR{" "}
                            {(typeof ticket.price === "string"
                              ? parseInt(ticket.price)
                              : ticket.price
                            ).toLocaleString()}
                          </Badge>
                        </div>
                        {ticket.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {ticket.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {ticket.availableQuantity} of {ticket.quantity}{" "}
                            available
                          </span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2"
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

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ticket)}
                          className="flex items-center gap-1"
                        >
                          <EditIcon className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ticket.id)}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
