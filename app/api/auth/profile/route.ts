import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Mock profile data based on token - replace with your actual profile logic
    // In production, you would verify the token and fetch real user data
    const mockProfile = {
      userId: "1",
      email: "test@example.com",
      isGoogleUser: false,
      isNewUser: false,
    };

    return NextResponse.json({
      success: true,
      data: mockProfile,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
