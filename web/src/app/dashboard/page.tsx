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
import {
  OrganizerDashboardView,
  CustomerDashboardView,
  UpcomingEvents,
} from "@/features/dashboard";
import {
  AnalyticsCard,
  RecentTransactions,
  EventReviews,
} from "@/features/dashboard/organizer";
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
              <OrganizerDashboardView />
            ) : session.user.role === "CUSTOMER" ? (
              <CustomerDashboardView />
            ) : (
              <>
                <AnalyticsCard />
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
