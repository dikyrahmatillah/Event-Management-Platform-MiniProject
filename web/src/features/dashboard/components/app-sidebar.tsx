"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { SearchForm } from "@/features/dashboard/components/search-form";
import { VersionSwitcher } from "@/features/dashboard/components/version-switcher";
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: string;
}

const organizerNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "Analytics", url: "/dashboard/analytics" },
      { title: "Attendees", url: "/dashboard/attendees" },
    ],
  },
  {
    title: "My Events",
    url: "/dashboard/events",
    items: [
      { title: "All Events", url: "/dashboard/events" },
      { title: "Create Event", url: "/dashboard/events/create" },
    ],
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    items: [
      { title: "Revenue", url: "/dashboard/transactions" },
      { title: "Pending Payment", url: "/dashboard/transactions/pending" },
      {
        title: "Awaiting Confirmation",
        url: "/dashboard/transactions/confirmation",
      },
    ],
  },
  {
    title: "Promotions",
    url: "/dashboard/promotions",
    items: [
      { title: "All Promotions", url: "/dashboard/promotions" },
      { title: "Create Voucher", url: "/dashboard/promotions/create" },
    ],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    items: [{ title: "Edit Profile", url: "/dashboard/profile" }],
  },
];

const customerNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    items: [{ title: "Overview", url: "/dashboard" }],
  },
  {
    title: "My Events",
    url: "/dashboard/events",
    items: [
      { title: "Registered Events", url: "/dashboard/events" },
      { title: "Browse Events", url: "/dashboard/events/browse" },
      { title: "Event History", url: "/dashboard/events/history" },
    ],
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    items: [
      { title: "Payment History", url: "/dashboard/payments" },
      { title: "Upload Proof", url: "/dashboard/payments/upload" },
    ],
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    items: [
      { title: "My Points", url: "/dashboard/rewards/points" },
      { title: "My Coupons", url: "/dashboard/rewards/coupons" },
      { title: "Referrals", url: "/dashboard/rewards/referrals" },
    ],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    items: [{ title: "Edit Profile", url: "/dashboard/profile" }],
  },
];

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  // Get navigation based on user role
  const getNavigationForRole = () => {
    if (userRole === "ORGANIZER") {
      return organizerNavigation;
    } else if (userRole === "CUSTOMER") {
      return customerNavigation;
    }
    // Default to organizer navigation for fallback
    return organizerNavigation;
  };

  const navMain = getNavigationForRole();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
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
