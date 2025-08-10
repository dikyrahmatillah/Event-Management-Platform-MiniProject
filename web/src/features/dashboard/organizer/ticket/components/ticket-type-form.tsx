import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import IDRCurrencyInput from "@/app/dashboard/organizer/events/idr";
import { ticketService } from "@/lib/api/ticket-service";
import { toast } from "sonner";
import {
  TicketTypeFormData,
  TicketTypeFormProps,
  ticketTypeSchema,
} from "@/types/ticket.types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";

export function TicketTypeForm({
  eventId,
  editingTicket,
  onSuccess,
  onCancel,
}: TicketTypeFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<TicketTypeFormData>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: editingTicket
      ? {
          typeName: editingTicket.typeName,
          description: editingTicket.description || "",
          price:
            typeof editingTicket.price === "string"
              ? parseInt(editingTicket.price)
              : editingTicket.price,
          quantity: editingTicket.quantity,
        }
      : {
          typeName: "",
          description: "",
          price: 0,
          quantity: 1,
        },
  });

  const doSubmit = async (data: TicketTypeFormData) => {
    setIsSubmitting(true);
    try {
      const ticketData = {
        eventId,
        typeName: data.typeName,
        description: data.description || "",
        price: data.price.toString(),
        quantity: data.quantity,
        availableQuantity: data.quantity,
      };
      if (editingTicket) {
        await ticketService.updateTicketType(
          editingTicket.id,
          ticketData,
          session?.user?.accessToken
        );
        toast.success("Ticket type updated successfully");
      } else {
        await ticketService.createTicketType(
          ticketData,
          session?.user?.accessToken
        );
        toast.success("Ticket type created successfully");
      }
      onSuccess();
      form.reset();
    } catch {
      toast.error("Failed to save ticket type. Please try again.");
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => setConfirmOpen(true))}
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            {editingTicket
              ? isSubmitting
                ? "Updating..."
                : "Update Ticket Type"
              : isSubmitting
              ? "Creating..."
              : "Create Ticket Type"}
          </Button>
        </div>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={editingTicket ? "Update Ticket Type" : "Create Ticket Type"}
          description={`Are you sure you want to ${
            editingTicket ? "update" : "create"
          } this ticket type?`}
          confirmLabel={editingTicket ? "Update" : "Create"}
          cancelLabel="Cancel"
          onConfirm={form.handleSubmit(doSubmit)}
          loading={isSubmitting}
          confirmClassName="bg-primary text-primary-foreground hover:bg-primary/90 text-white"
        />
      </form>
    </Form>
  );
}
