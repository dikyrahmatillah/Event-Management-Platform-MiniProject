"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../atomic/button";

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
  const router = useRouter();

  // Mock authentication state (replace with real auth)
  const isAuthenticated = false;
  // const userImage = "/user.jpg"; // replace with real image from auth

  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <nav className="w-full border-b px-4 py-4 shadow-sm sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between">
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
        <div className="md:hidden lg:hidden"></div>
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
            <Avatar
              className="w-9 h-9 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              {/* <AvatarImage src={userImage} /> */}
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
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
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
