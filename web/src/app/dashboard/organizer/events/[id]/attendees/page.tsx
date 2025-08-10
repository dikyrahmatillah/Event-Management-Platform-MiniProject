"use client";
import { useRouter, useParams } from "next/navigation";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { Button } from "@/components/ui/atomic/button";
import { ArrowLeftIcon } from "lucide-react";
import { useEventAttendees } from "@/features/dashboard/organizer/attendees/hooks/useEventAttendees";
import { AttendeeTable } from "@/features/dashboard/organizer/attendees/components/attendee-table";
import { AttendeeStats } from "@/features/dashboard/organizer/attendees/components/attendee-stats";
import { AttendeeFilter } from "@/features/dashboard/organizer/attendees/components/attendee-filter";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";

const STATUS = {
  ALL: "ALL",
  REGISTERED: "REGISTERED",
  ATTENDED: "ATTENDED",
  NO_SHOW: "NO_SHOW",
} as const;

export default function EventAttendeesPage() {
  const router = useRouter();
  const { id } = useParams();
  const eventId = Number(id);

  const {
    attendees,
    eventName,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    filteredAttendees,
    stats,
    statusDialog,
    handleStatusUpdate,
    confirmStatusUpdate,
    setStatusDialog,
    reloadAttendees,
  } = useEventAttendees(eventId);

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 self-start cursor-pointer"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
          <AttendeeFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            STATUS={STATUS}
          />
        </div>

        {!loading && attendees.length > 0 && <AttendeeStats stats={stats} />}

        <div className="mt-6">
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
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : (
            <>
              <AttendeeTable
                attendees={filteredAttendees}
                onStatusUpdate={handleStatusUpdate}
              />
              <ConfirmDialog
                open={statusDialog.open}
                onOpenChange={(open) =>
                  setStatusDialog((prev) => ({ ...prev, open }))
                }
                title="Update Attendee Status"
                description="Are you sure you want to update this attendee's status?"
                confirmLabel="Update"
                cancelLabel="Cancel"
                onConfirm={confirmStatusUpdate}
                loading={loading}
                confirmClassName="bg-blue-600 hover:bg-blue-700 text-white"
              />
            </>
          )}

          {!loading && attendees.length === 0 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={reloadAttendees}
                className="text-sm cursor-pointer"
              >
                Refresh List
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardPageLayout>
  );
}
