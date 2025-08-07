"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Bell, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/atomic/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atomic/dropdown-menu";
import { Badge } from "@/components/ui/atomic/badge";
import { SidebarTrigger } from "@/components/ui/atomic/sidebar";
import { Separator } from "@/components/ui/atomic/separator";
import { useUserActions } from "@/hooks/useUserActions";

interface DashboardNavbarProps {
  showSidebarTrigger?: boolean;
  showBrandLogo?: boolean;
  showSearch?: boolean;
  className?: string;
}

export default function DashboardNavbar({
  showSidebarTrigger = false,
  showBrandLogo = true,
  className = "",
}: DashboardNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useSession();
  const { user, getUserInitials, handleSignOut } = useUserActions();

  const isAuthenticated = status === "authenticated";

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`w-full border-b px-4 py-3 shadow-sm bg-white z-40 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </>
          )}

          {showBrandLogo && (
            <div className="flex">
              <Link href={isAuthenticated ? "/dashboard" : "/"}>
                <Image
                  src="/assets/logo.svg"
                  alt="evently logo"
                  width={190}
                  height={36}
                  className="h-8 w-[140px] hidden md:flex lg:flex"
                />
              </Link>
              <Link href={isAuthenticated ? "/dashboard" : "/"}>
                <Image
                  src="/assets/logo_responsive.svg"
                  alt="evently logo responsive"
                  width={32}
                  height={32}
                  className="flex md:hidden lg:hidden"
                />
              </Link>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="text-xs">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <Badge variant="outline" className="w-fit text-xs mt-1">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
