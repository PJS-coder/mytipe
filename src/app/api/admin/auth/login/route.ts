import { NextRequest, NextResponse } from "next/server";
import { isValidAdminPassword, createAdminSessionToken } from "@/server/auth/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password || !isValidAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid master password" },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: "mytipe_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("POST /api/admin/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
