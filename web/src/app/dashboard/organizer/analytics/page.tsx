import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { StatisticsMetrics } from "./components/statistics-metrics";
import { UnifiedAnalytics } from "./components/unified-analytics";
import { EventPerformanceTable } from "./components/event-performance-table";

export default function Analytics() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard/organizer" },
    { label: "Analytics", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title="Analytics"
      description="View detailed analytics and performance metrics for your events"
      breadcrumbs={breadcrumbs}
    >
      <StatisticsMetrics />

      <div className="px-4 lg:px-6">
        <UnifiedAnalytics />
      </div>

      <div className="px-4 lg:px-6">
        <EventPerformanceTable />
      </div>
    </DashboardPageLayout>
  );
}
