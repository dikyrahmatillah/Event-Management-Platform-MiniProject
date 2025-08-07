"use client";

import React from "react";
import { Card } from "@/components/ui/atomic/card";
import {
  CalendarIcon,
  TicketIcon,
  TrophyIcon,
  CreditCardIcon,
} from "lucide-react";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { useSession } from "next-auth/react";
import { PointsCard } from "@/features/dashboard/customer/components/points-card";
import { CouponsCard } from "@/features/dashboard/customer/components/coupons-card";

export default function CustomerDashboardPage() {
  const breadcrumbs = [
    { label: "Customer Dashboard", href: "/dashboard/customer" },
    { label: "Overview", isActive: true },
  ];
  const { data: session } = useSession();

  return (
    <DashboardPageLayout
      title={`Welcome back, ${session?.user?.name || "Customer"}`}
      description="Here's your event overview and activity summary."
      breadcrumbs={breadcrumbs}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registered Events</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TicketIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tickets</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrophyIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reward Points</p>
              <p className="text-2xl font-bold">1,250</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCardIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">Rp 2.5M</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Points and Coupons Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
        <PointsCard />
        <CouponsCard />
      </div>

      {/* Quick Actions */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Tech Conference 2025</p>
                  <p className="text-sm text-muted-foreground">
                    March 15, 2025
                  </p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Confirmed
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Music Festival</p>
                  <p className="text-sm text-muted-foreground">April 2, 2025</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Paid
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Registered for Tech Conference 2025</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">
                    Payment confirmed for Music Festival
                  </p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Earned 100 reward points</p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
