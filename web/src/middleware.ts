import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  if (!session?.user) {
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/organizer") && session.user.role !== "ORGANIZER") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/customer") && session.user.role !== "CUSTOMER") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/organizer/:path*", "/customer/:path*"],
};
