import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/atomic/breadcrumb";
import { Separator } from "@/components/ui/atomic/separator";
import { SidebarTrigger } from "@/components/ui/atomic/sidebar";
import { RecentTransactions } from "@/app/dashboard/components/recent-transactions";
import { UpcomingEvents } from "@/app/dashboard/components/upcoming-events";
import { EventReviews } from "@/app/dashboard/components/event-reviews";
import { DashboardAnalytics } from "@/app/dashboard/components/dashboard-anayltics";
import { CustomerPointsCard } from "@/app/dashboard/components/customer-points-card";
import { CustomerCouponsCard } from "@/app/dashboard/components/customer-coupons-card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {session.user.role === "ORGANIZER" ? (
              <>
                <DashboardAnalytics />
                <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-4">
                  <div className="xl:col-span-2">
                    <RecentTransactions />
                  </div>
                  <div className="xl:col-span-2">
                    <UpcomingEvents />
                  </div>
                </div>
                <div className="px-4 lg:px-6">
                  <EventReviews />
                </div>
              </>
            ) : session.user.role === "CUSTOMER" ? (
              <>
                <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-4">
                  <div className="xl:col-span-2">
                    <CustomerPointsCard />
                  </div>
                  <div className="xl:col-span-2">
                    <CustomerCouponsCard />
                  </div>
                </div>
                <div className="px-4 lg:px-6">
                  <UpcomingEvents />
                </div>
              </>
            ) : (
              <>
                <DashboardAnalytics />
                <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-4">
                  <div className="xl:col-span-2">
                    <RecentTransactions />
                  </div>
                  <div className="xl:col-span-2">
                    <UpcomingEvents />
                  </div>
                </div>
                <div className="px-4 lg:px-6">
                  <EventReviews />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
