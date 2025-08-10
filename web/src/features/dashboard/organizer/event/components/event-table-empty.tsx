import Link from "next/link";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";

export function EventsTableEmpty() {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground mb-2">
          No events found
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first event to get started
        </p>
        <Link href="/dashboard/organizer/events/create">
          <Button className="cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    </Card>
  );
}
