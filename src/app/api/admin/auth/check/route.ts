import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/server/auth/admin";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("mytipe_admin_session")?.value;
  const isAuthenticated = verifyAdminSessionToken(token);

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}
