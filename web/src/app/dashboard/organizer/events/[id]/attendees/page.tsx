"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AttendeeTable } from "@/features/dashboard/attendees/pages/attendee-table.page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/atomic/alert-dialog";
import { attendeeService } from "@/lib/api/attendee-service";
import { Attendee } from "@/types/attendee.types";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import {
  ArrowLeftIcon,
  UserIcon,
  DownloadIcon,
  FilterIcon,
} from "lucide-react";
import EventService from "@/lib/api/event-service";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atomic/select";

export default function EventAttendeesPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    attendeeId: number | null;
    newStatus: "REGISTERED" | "ATTENDED" | "NO_SHOW" | null;
  }>({ open: false, attendeeId: null, newStatus: null });

  const { data: session } = useSession();

  // Filter attendees based on status
  const filteredAttendees =
    statusFilter === "ALL"
      ? attendees
      : attendees.filter((attendee) => attendee.status === statusFilter);

  // Calculate statistics
  const stats = {
    total: attendees.length,
    registered: attendees.filter((a) => a.status === "REGISTERED" || !a.status)
      .length,
    attended: attendees.filter((a) => a.status === "ATTENDED").length,
    noShow: attendees.filter((a) => a.status === "NO_SHOW").length,
  };

  const handleStatusUpdate = async (
    attendeeId: number,
    status: "REGISTERED" | "ATTENDED" | "NO_SHOW"
  ) => {
    setStatusDialog({ open: true, attendeeId, newStatus: status });
    return;
  };

  const confirmStatusUpdate = async () => {
    if (!statusDialog.attendeeId || !statusDialog.newStatus) return;
    try {
      const token = session?.user?.accessToken;
      await attendeeService.updateAttendeeStatus(
        statusDialog.attendeeId,
        statusDialog.newStatus,
        token
      );
      setAttendees((prev) =>
        prev.map((attendee) =>
          attendee.id === statusDialog.attendeeId
            ? {
                ...attendee,
                status: statusDialog.newStatus as
                  | "REGISTERED"
                  | "ATTENDED"
                  | "NO_SHOW"
                  | undefined,
              }
            : attendee
        )
      );
      setUpdateMessage("Attendee status updated successfully!");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      console.error("Error updating attendee status:", error);
      setUpdateMessage("Error updating attendee status. Please try again.");
      setTimeout(() => setUpdateMessage(""), 3000);
    } finally {
      setStatusDialog({ open: false, attendeeId: null, newStatus: null });
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!eventId) return;

      setLoading(true);
      try {
        const eventService = new EventService();
        const eventData = await eventService.getEventById(eventId);
        if (eventData) {
          setEventName(eventData.eventName);
        }

        const token = session?.user?.accessToken;
        const attendeeData = await attendeeService.getAttendeesByEventId(
          eventId,
          token
        );
        setAttendees(attendeeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [eventId, session]);

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    {
      label: eventName || `Event #${eventId}`,
      href: `/dashboard/organizer/events/${eventId}`,
    },
    { label: "Attendees", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title={`Attendees for ${eventName || `Event #${eventId}`}`}
      description="Manage and track all registered attendees for this event"
      breadcrumbs={breadcrumbs}
    >
      <div className="px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto">
        {updateMessage && (
          <div
            className={`mb-4 p-3 rounded-md ${
              updateMessage.includes("Error")
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {updateMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 self-start"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Event
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="REGISTERED">Registered</SelectItem>
                  <SelectItem value="ATTENDED">Attended</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export List button removed */}
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && attendees.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Attendees
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {stats.registered}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Registered
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {stats.attended}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Attended
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-red-600">
                  {stats.noShow}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No Show
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="text-base sm:text-lg">Attendee List</span>
              </div>
              <div className="bg-primary/10 text-primary text-xs sm:text-sm px-2 py-0.5 rounded-full self-start sm:self-auto">
                {filteredAttendees.length}{" "}
                {filteredAttendees.length === 1 ? "attendee" : "attendees"}
                {statusFilter !== "ALL" && (
                  <span className="text-[10px] sm:text-xs"> (filtered)</span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-12 animate-pulse bg-muted rounded"></div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse bg-muted/50 rounded"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                <AttendeeTable
                  attendees={filteredAttendees}
                  onStatusUpdate={handleStatusUpdate}
                />
                <AlertDialog
                  open={statusDialog.open}
                  onOpenChange={(open) =>
                    setStatusDialog((d) => ({ ...d, open }))
                  }
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Change Attendee Status
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change this attendee&apos;s
                        status to <b>{statusDialog.newStatus}</b>?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() =>
                          setStatusDialog({
                            open: false,
                            attendeeId: null,
                            newStatus: null,
                          })
                        }
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmStatusUpdate}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {!loading &&
              filteredAttendees.length === 0 &&
              attendees.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm sm:text-base">
                    No attendees found with the selected status filter.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter("ALL")}
                    className="mt-2"
                  >
                    Clear Filter
                  </Button>
                </div>
              )}

            {!loading && attendees.length === 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="text-sm"
                >
                  Refresh List
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
