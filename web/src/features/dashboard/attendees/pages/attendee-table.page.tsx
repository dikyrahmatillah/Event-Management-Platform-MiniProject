import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atomic/table";
import { Attendee } from "@/types/attendee.types";

interface AttendeeTableProps {
  attendees: Attendee[];
}

export function AttendeeTable({ attendees }: AttendeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Ticket Quantity</TableHead>
          <TableHead>Total Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No attendees found.
            </TableCell>
          </TableRow>
        ) : (
          attendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell>{attendee.eventName}</TableCell>
              <TableCell>{attendee.name}</TableCell>
              <TableCell>{attendee.ticketQuantity}</TableCell>
              <TableCell>
                Rp {Number(attendee.totalPrice).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
