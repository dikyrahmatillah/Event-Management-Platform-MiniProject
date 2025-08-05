"use client";

import React from "react";
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

interface DashboardPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
}

export function DashboardPageLayout({
  children,
  title,
  description,
  breadcrumbs = [],
}: DashboardPageLayoutProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem
                    className={index === 0 ? "hidden md:block" : ""}
                  >
                    {crumb.isActive ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href || "#"}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {(title || description) && (
              <div className="px-4 lg:px-6">
                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
