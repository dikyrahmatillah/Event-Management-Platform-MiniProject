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
import { Button } from "@/components/ui/atomic/button";
import { UserIcon, CheckIcon, XIcon, ClockIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/atomic/tooltip";
import { useState } from "react";

interface AttendeeTableProps {
  attendees: Attendee[];
  onStatusUpdate?: (
    attendeeId: number,
    status: "REGISTERED" | "ATTENDED" | "NO_SHOW"
  ) => Promise<void>;
}

export function AttendeeTable({
  attendees,
  onStatusUpdate,
}: AttendeeTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const handleStatusChange = async (
    attendeeId: number,
    newStatus: "REGISTERED" | "ATTENDED" | "NO_SHOW"
  ) => {
    if (!onStatusUpdate) return;

    setUpdatingStatus(attendeeId);
    try {
      await onStatusUpdate(attendeeId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATTENDED":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <CheckIcon className="h-3 w-3 mr-1" />
            Attended
          </Badge>
        );
      case "NO_SHOW":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-300"
          >
            <XIcon className="h-3 w-3 mr-1" />
            No Show
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            <ClockIcon className="h-3 w-3 mr-1" />
            Registered
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-md border w-full">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 h-12 md:h-14">
            <TableHead className="hidden sm:table-cell w-[50px] px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
              #
            </TableHead>
            <TableHead className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
              Attendee
            </TableHead>
            <TableHead className="hidden md:table-cell px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
              Tickets
            </TableHead>
            <TableHead className="hidden lg:table-cell text-right px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
              Total Price
            </TableHead>
            <TableHead className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
              Status
            </TableHead>
            {onStatusUpdate && (
              <TableHead className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
                Actions
              </TableHead>
            )}
            <TableHead className="hidden xl:table-cell text-right px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
              Transaction ID
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={onStatusUpdate ? 7 : 6}
                className="text-center py-12 text-lg"
              >
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <UserIcon className="h-14 w-14 mb-2 opacity-20" />
                  <p>No attendees registered for this event yet.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            attendees.map((attendee, index) => (
              <TableRow
                key={attendee.id}
                className="hover:bg-muted/30 h-auto min-h-[3rem] md:h-14"
              >
                <TableCell className="hidden sm:table-cell font-mono text-muted-foreground px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
                  {index + 1}
                </TableCell>
                <TableCell className="px-2 md:px-4 py-2 md:py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-xs md:text-base truncate">
                      {attendee.name}
                    </span>
                    <div className="flex flex-col gap-0.5 text-[10px] md:text-xs text-muted-foreground">
                      <span>ID: {attendee.userId}</span>
                      <span className="sm:hidden">#{index + 1}</span>
                      <div className="md:hidden flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-medium text-[10px] px-1 py-0.5"
                        >
                          {attendee.ticketQuantity}{" "}
                          {attendee.ticketQuantity === 1 ? "ticket" : "tickets"}
                        </Badge>
                      </div>
                      <span className="lg:hidden font-medium">
                        IDR {Number(attendee.totalPrice).toLocaleString()}
                      </span>
                      <span className="xl:hidden font-mono">
                        #{attendee.transactionId}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell px-2 md:px-4 py-2 md:py-3">
                  <Badge
                    variant="outline"
                    className="font-medium text-xs md:text-base px-2 md:px-3 py-1"
                  >
                    {attendee.ticketQuantity}{" "}
                    {attendee.ticketQuantity === 1 ? "ticket" : "tickets"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right font-medium px-2 md:px-4 py-2 md:py-3 text-xs md:text-base">
                  IDR {Number(attendee.totalPrice).toLocaleString()}
                </TableCell>
                <TableCell className="px-2 md:px-4 py-2 md:py-3">
                  {getStatusBadge(attendee.status || "REGISTERED")}
                </TableCell>
                {onStatusUpdate && (
                  <TableCell className="px-2 md:px-4 py-2 md:py-3">
                    <div className="flex items-center gap-1">
                      {attendee.status !== "ATTENDED" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(attendee.id, "ATTENDED")
                                }
                                disabled={updatingStatus === attendee.id}
                              >
                                <CheckIcon className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as Attended</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {attendee.status !== "NO_SHOW" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(attendee.id, "NO_SHOW")
                                }
                                disabled={updatingStatus === attendee.id}
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as No Show</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                )}
                <TableCell className="hidden xl:table-cell text-right font-mono text-[10px] md:text-xs text-muted-foreground px-2 md:px-4 py-2 md:py-3">
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
