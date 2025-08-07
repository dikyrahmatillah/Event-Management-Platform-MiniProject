"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/atomic/sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/atomic/separator";
import Link from "next/link";

const organizerNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard/organizer",
    items: [
      { title: "Overview", url: "/dashboard/organizer" },
      { title: "Analytics", url: "/dashboard/organizer/analytics" },
    ],
  },
  {
    title: "My Events",
    url: "/dashboard/organizer/events",
    items: [
      { title: "All Events", url: "/dashboard/organizer/events" },
      { title: "Create Event", url: "/dashboard/organizer/events/create" },
    ],
  },
  {
    title: "Transactions",
    url: "/dashboard/organizer/transactions",
    items: [
      { title: "Revenue", url: "/dashboard/organizer/transactions" },
      {
        title: "Pending Payment",
        url: "/dashboard/organizer/transactions/pending",
      },
      {
        title: "Awaiting Confirmation",
        url: "/dashboard/organizer/transactions/confirmation",
      },
    ],
  },
  {
    title: "Promotions",
    url: "/dashboard/organizer/promotions",
    items: [
      { title: "All Promotions", url: "/dashboard/organizer/promotions" },
      {
        title: "Create Voucher",
        url: "/dashboard/organizer/promotions/create",
      },
    ],
  },
  {
    title: "Profile",
    url: "/dashboard/organizer/profile",
    items: [{ title: "Edit Profile", url: "/dashboard/organizer/profile" }],
  },
];

const customerNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard/customer",
    items: [{ title: "Overview", url: "/dashboard/customer" }],
  },
  {
    title: "My Events",
    url: "/dashboard/customer/events",
    items: [
      { title: "Registered Events", url: "/dashboard/customer/events" },
      { title: "Browse Events", url: "/dashboard/customer/events/browse" },
      { title: "Event History", url: "/dashboard/customer/events/history" },
    ],
  },
  {
    title: "Payments",
    url: "/dashboard/customer/payments",
    items: [
      { title: "Payment History", url: "/dashboard/customer/payments" },
      { title: "Upload Proof", url: "/dashboard/customer/payments/upload" },
    ],
  },
  {
    title: "Rewards",
    url: "/dashboard/customer/rewards",
    items: [
      { title: "My Points", url: "/dashboard/customer/rewards/points" },
      { title: "My Coupons", url: "/dashboard/customer/rewards/coupons" },
      { title: "Referrals", url: "/dashboard/customer/rewards/referrals" },
    ],
  },
  {
    title: "Profile",
    url: "/dashboard/customer/profile",
    items: [{ title: "Edit Profile", url: "/dashboard/customer/profile" }],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: string;
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = userRole || session?.user?.role;

  const getNavigationForRole = () => {
    if (role === "ORGANIZER") {
      return organizerNavigation;
    } else if (role === "CUSTOMER") {
      return customerNavigation;
    }
    return organizerNavigation;
  };

  const navMain = getNavigationForRole();
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarHeader>
          <div className="mb-4 flex flex-col items-center">
            <Link href="/">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                height={32}
                width={128}
                className="h-11"
              />
            </Link>

            <Separator className="my-2 w-full" />
          </div>
        </SidebarHeader>
        {navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === subItem.url}
                    >
                      <a href={subItem.url}>{subItem.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
