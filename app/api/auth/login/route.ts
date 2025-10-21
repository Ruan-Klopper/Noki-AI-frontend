import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock authentication - replace with your actual auth logic
    if (email === "test@example.com" && password === "password") {
      return NextResponse.json({
        success: true,
        data: {
          access_token: "mock_access_token_" + Date.now(),
          user: {
            id: "1",
            firstname: "Test",
            lastname: "User",
            email: email,
          },
        },
        message: "Login successful",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
