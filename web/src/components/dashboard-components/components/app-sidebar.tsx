import * as React from "react";

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

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      items: [
        { title: "Overview", url: "/dashboard", isActive: true },
        { title: "Statistics", url: "/dashboard/statistics" },
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
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
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
