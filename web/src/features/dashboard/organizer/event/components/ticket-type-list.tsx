import React from "react";
import { Badge } from "@/components/ui/atomic/badge";
import { TicketIcon } from "lucide-react";
import { TicketTypes } from "@/types/ticket.types";

export function TicketTypeList({
  ticketTypes,
}: {
  ticketTypes: TicketTypes[];
}) {
  if (ticketTypes.length === 0) {
    return (
      <div className="bg-muted/40 rounded-lg p-6 text-center">
        <TicketIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
        <p className="text-sm font-medium">No ticket types available</p>
      </div>
    );
  }
  return (
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
                {ticket.availableQuantity} of {ticket.quantity} available
              </div>
              <div className="w-32 bg-muted rounded-full h-1.5 mt-1">
                <div
                  className="bg-primary rounded-full h-1.5"
                  style={{
                    width: `${
                      ((ticket.quantity - ticket.availableQuantity) /
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
  );
}
