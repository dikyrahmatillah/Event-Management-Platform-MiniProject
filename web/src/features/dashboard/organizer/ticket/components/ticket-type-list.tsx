import { TicketTypes } from "@/types/ticket.types";
import { Button } from "@/components/ui/atomic/button";
import { Badge } from "@/components/ui/atomic/badge";
import { EditIcon, TrashIcon } from "lucide-react";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";
import { useState } from "react";

interface TicketTypeListProps {
  ticketTypes: TicketTypes[];
  onEdit: (ticket: TicketTypes) => void;
  onDelete: (ticketId: number) => void;
}

export function TicketTypeList({
  ticketTypes,
  onEdit,
  onDelete,
}: TicketTypeListProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ticketId: number | null;
  }>({ open: false, ticketId: null });

  return (
    <div>
      <div className="border rounded-lg p-4">
        <div className="font-semibold mb-2">Existing Ticket Types</div>
        {ticketTypes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No ticket types created yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ticketTypes.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-3">
                      {ticket.typeName}
                      <Badge
                        variant="secondary"
                        className="font-semibold text-base px-3 py-1"
                      >
                        IDR {Number(ticket.price).toLocaleString()}
                      </Badge>
                    </div>
                    {ticket.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {ticket.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {ticket.availableQuantity} of {ticket.quantity} available
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:ml-4 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(ticket)}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <EditIcon className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDeleteDialog({ open: true, ticketId: ticket.id })
                      }
                      className="flex items-center gap-1 text-destructive hover:text-destructive cursor-pointer"
                    >
                      <TrashIcon className="h-3 w-3" /> Delete
                    </Button>
                    <ConfirmDialog
                      open={
                        deleteDialog.open && deleteDialog.ticketId === ticket.id
                      }
                      onOpenChange={(open) =>
                        setDeleteDialog((d) => ({ ...d, open }))
                      }
                      title="Delete Ticket Type"
                      description="Are you sure you want to delete this ticket type? This action cannot be undone."
                      confirmLabel="Delete"
                      cancelLabel="Cancel"
                      onConfirm={() => {
                        if (deleteDialog.ticketId)
                          onDelete(deleteDialog.ticketId);
                        setDeleteDialog({ open: false, ticketId: null });
                      }}
                      confirmClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
