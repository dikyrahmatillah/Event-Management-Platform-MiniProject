"use client";

import React from "react";
import { Card } from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function CustomerEventsPage() {
  const breadcrumbs = [
    { label: "Customer Dashboard", href: "/dashboard/customer" },
    { label: "My Events", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title="My Registered Events"
      description="View and manage your event registrations."
      breadcrumbs={breadcrumbs}
    >
      {/* Sample Events */}
      <div className="px-4 lg:px-6 space-y-4">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Tech Conference 2025</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  March 15, 2025
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  Jakarta Convention Center
                </div>
                <div className="flex items-center gap-1">
                  <TicketIcon className="h-4 w-4" />
                  VIP Ticket
                </div>
              </div>
              <p className="mt-2 text-sm">
                Join industry leaders for the biggest tech conference of the
                year.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Confirmed
              </span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Music Festival</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  April 2, 2025
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  Gelora Bung Karno Stadium
                </div>
                <div className="flex items-center gap-1">
                  <TicketIcon className="h-4 w-4" />
                  General Admission
                </div>
              </div>
              <p className="mt-2 text-sm">
                Experience amazing live performances from top artists.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Paid
              </span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Startup Workshop</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  February 28, 2025
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  Online Event
                </div>
                <div className="flex items-center gap-1">
                  <TicketIcon className="h-4 w-4" />
                  Early Bird
                </div>
              </div>
              <p className="mt-2 text-sm">
                Learn from successful entrepreneurs and build your startup.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Pending Payment
              </span>
              <Button variant="outline" size="sm">
                Complete Payment
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
