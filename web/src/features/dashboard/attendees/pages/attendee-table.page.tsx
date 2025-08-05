import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atomic/table";
import { Attendee } from "@/types/attendee.types";
import { Badge } from "@/components/ui/atomic/badge";
import { UserIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/atomic/tooltip";

interface AttendeeTableProps {
  attendees: Attendee[];
}

export function AttendeeTable({ attendees }: AttendeeTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="text-base">
        <TableHeader>
          <TableRow className="bg-muted/50 h-16 text-lg">
            <TableHead className="w-[70px] px-6">#</TableHead>
            <TableHead className="px-6">Attendee</TableHead>
            <TableHead className="px-6">Tickets</TableHead>
            <TableHead className="text-right px-6">Total Price</TableHead>
            <TableHead className="text-right px-6">Transaction ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-lg">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <UserIcon className="h-16 w-16 mb-2 opacity-20" />
                  <p>No attendees registered for this event yet.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            attendees.map((attendee, index) => (
              <TableRow
                key={attendee.id}
                className="hover:bg-muted/30 h-16 text-lg"
              >
                <TableCell className="font-mono text-muted-foreground px-6">
                  {index + 1}
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-base">
                      {attendee.name}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground cursor-help">
                            ID: {attendee.userId}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>User ID</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <Badge
                    variant="outline"
                    className="font-semibold text-base px-3 py-1"
                  >
                    {attendee.ticketQuantity}{" "}
                    {attendee.ticketQuantity === 1 ? "ticket" : "tickets"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-base px-6">
                  IDR {Number(attendee.totalPrice).toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground px-6">
                  #{attendee.transactionId}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
