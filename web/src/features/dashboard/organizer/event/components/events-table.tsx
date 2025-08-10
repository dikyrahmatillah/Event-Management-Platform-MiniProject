import React from "react";
import { Card } from "@/components/ui/atomic/card";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";
import { EventTypes } from "@/types/event.type";
import { EventTableRow } from "@/features/dashboard/organizer/event/components/event-table-row";
import { EventsTableEmpty } from "@/features/dashboard/organizer/event/components/event-table-empty";
import { useDeleteDialog } from "@/features/dashboard/organizer/event/hooks/useDeleteDialog";
import { LoadingSkeleton } from "@/components/ui/atomic/loading-skeleton"; // <-- Import the skeleton

interface EventsTableProps {
  events: EventTypes[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
}

export function EventsTable({
  events,
  isLoading,
  error,
  onDelete,
}: EventsTableProps) {
  const { dialog, openDialog, closeDialog, setDialog } = useDeleteDialog();

  const handleDelete = async () => {
    if (!dialog.eventId) return;
    await onDelete(dialog.eventId);
    closeDialog();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
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
    return <EventsTableEmpty />;
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
              <EventTableRow
                key={event.id}
                event={event}
                onDeleteClick={openDialog}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={dialog.isOpen && dialog.eventId !== null}
        onOpenChange={(open) =>
          setDialog((prev) => ({ ...prev, isOpen: open }))
        }
        title={`Delete Event: ${dialog.eventName}`}
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        confirmClassName="bg-red-600 hover:bg-red-700 text-white"
      />
    </Card>
  );
}
