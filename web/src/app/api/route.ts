import { NextRequest, NextResponse } from "next/server";

type Role = "ORGANIZER" | "CUSTOMER";

interface MockUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: Role;
  profilePicture?: string;
  referralCode?: string;
  referredBy?: number | null;
}

const mockUsers: MockUser[] = [
  {
    id: 1,
    email: "user1@example.com",
    password: "password1",
    firstName: "User",
    lastName: "One",
    phone: "123-456-7890",
    role: "ORGANIZER",
    profilePicture: "https://example.com/user1.jpg",
    referralCode: "REF123",
    referredBy: null,
  },
  {
    id: 2,
    email: "user2@example.com",
    password: "password2",
    firstName: "User",
    lastName: "Two",
    phone: "123-456-7890",
    role: "CUSTOMER",
    profilePicture: "https://example.com/user2.jpg",
    referralCode: "REF456",
    referredBy: null,
  },
  {
    id: 3,
    email: "user3@example.com",
    password: "password3",
    firstName: "User",
    lastName: "Three",
    phone: "123-456-7890",
    role: "CUSTOMER",
    profilePicture: "https://example.com/user3.jpg",
    referralCode: "REF789",
    referredBy: 2,
  },
];

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (email) {
    const user = mockUsers.find((user) => user.email === email);
    if (user) {
      return NextResponse.json(user);
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(mockUsers);
}

export async function POST(request: NextRequest) {}
