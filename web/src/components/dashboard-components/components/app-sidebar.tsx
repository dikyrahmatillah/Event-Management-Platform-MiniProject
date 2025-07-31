"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { SearchForm } from "./search-form";
import { VersionSwitcher } from "./version-switcher";
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
} from "@/components/ui/sidebar";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
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
        { title: "All Transactions", url: "/dashboard/transactions" },
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
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
