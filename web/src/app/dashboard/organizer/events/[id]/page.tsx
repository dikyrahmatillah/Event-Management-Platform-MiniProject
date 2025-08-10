"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { EventDetailCard } from "@/features/dashboard/organizer/event/components/event-detail-card";
import { EventDetailSkeleton } from "@/features/dashboard/organizer/event/components/event-detail-skeleton";
import { ErrorCard } from "@/features/dashboard/organizer/components/error-card";
import { useEventDetail } from "@/features/dashboard/organizer/event/hooks/useEventDetail";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    event,
    ticketTypes,
    loading,
    error,
    handleDeleteEvent,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useEventDetail(Number(params.id), session?.user?.accessToken, router);

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    { label: event?.eventName || "Event Details", isActive: true },
  ];

  if (loading) {
    return (
      <DashboardPageLayout
        title="Event Details"
        description="View and manage event information"
        breadcrumbs={breadcrumbs}
      >
        <EventDetailSkeleton />
      </DashboardPageLayout>
    );
  }

  if (error) {
    return (
      <DashboardPageLayout
        title="Event Details"
        description="View and manage event information"
        breadcrumbs={breadcrumbs}
      >
        <ErrorCard message={error} />
      </DashboardPageLayout>
    );
  }

  if (!event) {
    return (
      <DashboardPageLayout
        title="Event Details"
        description="View and manage event information"
        breadcrumbs={breadcrumbs}
      >
        <ErrorCard message="Event not found." showBack />
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      title={event.eventName}
      description="View and manage event information"
      breadcrumbs={breadcrumbs}
    >
      <EventDetailCard
        event={event}
        ticketTypes={ticketTypes}
        onDelete={() => setDeleteDialogOpen(true)}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onConfirmDelete={handleDeleteEvent}
        loading={loading}
      />
    </DashboardPageLayout>
  );
}
