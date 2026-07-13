import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export default async function proxy(request: NextRequest) {
  return createClient(request);
}

export const config = {
  // skip static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
