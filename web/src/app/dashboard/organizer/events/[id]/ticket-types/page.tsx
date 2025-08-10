"use client";

import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTicketTypes } from "@/features/dashboard/organizer/ticket/hooks/useTicketTypes";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { Button } from "@/components/ui/atomic/button";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { TicketTypeForm } from "@/features/dashboard/organizer/ticket/components/ticket-type-form";
import { TicketTypeList } from "@/features/dashboard/organizer/ticket/components/ticket-type-list";
import { useState } from "react";

export default function TicketTypesPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { data: session } = useSession();

  const {
    event,
    ticketTypes,
    loading,
    refresh,
    handleDelete,
    editingTicket,
    setEditingTicket,
  } = useTicketTypes(Number(eventId), session?.user?.accessToken);

  const [showForm, setShowForm] = useState(false);

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    {
      label: event?.eventName || "Event",
      href: `/dashboard/organizer/events/${eventId}`,
    },
    { label: "Ticket Types", isActive: true },
  ];

  if (loading) {
    return (
      <DashboardPageLayout
        title="Manage Ticket Types"
        description="Create and manage ticket types for your event"
        breadcrumbs={breadcrumbs}
      >
        <div className="space-y-6 px-4 lg:px-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center py-8">
            <div className="animate-pulse flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2.5"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      title="Manage Ticket Types"
      description={`Create and manage ticket types for ${
        event?.eventName || "your event"
      }`}
      breadcrumbs={breadcrumbs}
    >
      <div className="px-4 lg:px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
          {!showForm && (
            <Button
              onClick={() => {
                setEditingTicket(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" /> Add Ticket Type
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {showForm && (
            <TicketTypeForm
              eventId={Number(eventId)}
              editingTicket={editingTicket}
              onSuccess={() => {
                setShowForm(false);
                setEditingTicket(null);
                refresh();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingTicket(null);
              }}
            />
          )}

          <TicketTypeList
            ticketTypes={ticketTypes}
            onEdit={(ticket) => {
              setEditingTicket(ticket);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DashboardPageLayout>
  );
}
