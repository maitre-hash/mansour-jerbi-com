import { type NextRequest } from "next/server";
import { updateSessionAndProtectAdmin } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSessionAndProtectAdmin(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
