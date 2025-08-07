"use client";

import Image from "next/image";
import Link from "next/link";
// Removed useRouter import
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../atomic/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atomic/dropdown-menu";
import { UserIcon, LogOut } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const navLinks: NavItem[] = [
  { label: "Create Event", href: "/create-event" },
  { label: "Browse Event", href: "/browse-event" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/dashboard";
    return session.user.role === "ORGANIZER"
      ? "/dashboard/organizer"
      : "/dashboard/customer";
  };
  return (
    <nav className="w-full border-b px-4 py-4 shadow-sm sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between">
        <div className="flex">
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="evently logo "
              width={190}
              height={36}
              className="h-10 w-[170px] hidden md:flex lg:flex"
            />
          </Link>
          <Link href="/">
            <Image
              src="/assets/logo_responsive.svg"
              alt="evently logo responsive"
              width={32}
              height={32}
              className="flex md:hidden lg:hidden"
            />
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-sans hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Button asChild variant="outline">
                <Link href="/auth/sign-in" className="font-sans">
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up" className="font-sans">
                  Sign Up
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link href={getDashboardLink()} className="font-sans">
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 cursor-pointer"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href={
                        session?.user?.role === "ORGANIZER"
                          ? "/dashboard/organizer/profile"
                          : "/dashboard/customer/profile"
                      }
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm font-sans hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link
                href="/auth/sign-in"
                className="block px-4 py-2 text-sm font-sans hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="block px-4 py-2 text-sm font-sans hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={getDashboardLink()}
                className="block px-4 py-2 text-sm font-sans hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href={
                  session?.user?.role === "ORGANIZER"
                    ? "/dashboard/organizer/profile"
                    : "/dashboard/customer/profile"
                }
                className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </span>
              </Link>
              <div className="border-t border-gray-200">
                <div className="px-4 py-2 text-xs text-gray-500">
                  {session?.user?.email}
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
