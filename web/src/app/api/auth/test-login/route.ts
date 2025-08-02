import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Testing login with:", body);

    // Forward to backend API
    const apiUrl = process.env.API_URL;
    console.log("API URL:", apiUrl);

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Error testing login:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
