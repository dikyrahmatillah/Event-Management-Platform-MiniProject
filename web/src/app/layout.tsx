import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/atomic/sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evently",
  description: "Find and Make event easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${manrope.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
