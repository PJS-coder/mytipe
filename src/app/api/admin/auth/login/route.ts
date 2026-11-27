import { NextRequest, NextResponse } from "next/server";
import { isValidAdminPassword, createAdminSessionToken } from "@/server/auth/admin";
import { checkRateLimit, getClientIp } from "@/server/security/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`admin-login:${clientIp}`, {
      maxRequests: 5,
      windowSeconds: 15 * 60, // 5 attempts per 15 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again in ${Math.ceil(
            rateLimit.resetSeconds / 60
          )} minute(s).`,
        },
        { status: 429 }
      );
    }

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
