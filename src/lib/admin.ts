import type { SupabaseClient } from "@supabase/supabase-js";

// Role lives in the profiles table (assigned by an admin, never at signup).
// The database's is_admin() policies are the real gate; this only drives the UI.
export async function isAdmin(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role === "admin";
}
