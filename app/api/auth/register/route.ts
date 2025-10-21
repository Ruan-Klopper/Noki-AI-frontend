import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, password } = body;

    // Basic validation
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
          code: "INVALID_EMAIL",
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
          code: "WEAK_PASSWORD",
        },
        { status: 400 }
      );
    }

    // Name validation
    if (firstname.trim().length < 2 || lastname.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name and last name must be at least 2 characters long",
          code: "INVALID_NAME",
        },
        { status: 400 }
      );
    }

    // Call the actual backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const registerUrl = `${backendUrl}/auth/register`;

    const response = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.toLowerCase(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle backend errors - pass through the backend error message directly
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registration failed",
        },
        { status: response.status }
      );
    }

    // Return the backend response in the expected format
    return NextResponse.json({
      success: true,
      data: {
        access_token: data.access_token,
        user: data.user,
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
