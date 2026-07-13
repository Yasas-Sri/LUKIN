import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase, user.id))) redirect("/");

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-40 pb-20 print:pt-0">
      <div className="flex items-center gap-6 border-b pb-4 mb-8 print:hidden">
        <h1 className="text-xl font-bold uppercase tracking-widest">Admin</h1>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin" className="hover:underline">Dashboard</Link>
          <Link href="/admin/products" className="hover:underline">Products</Link>
          <Link href="/admin/orders" className="hover:underline">Orders</Link>
          <Link href="/admin/employees" className="hover:underline">Employees</Link>
          <Link href="/admin/users" className="hover:underline">Users</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
