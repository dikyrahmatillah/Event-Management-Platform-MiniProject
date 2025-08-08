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
      {breadcrumbs.length > 0 && (
        <div className="border-b px-4 py-3 bg-gray-50/50">
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
        </div>
      )}

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
