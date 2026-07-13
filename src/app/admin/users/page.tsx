import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { updateUserRole } from "../actions";

export default async function AdminUsers() {
  const supabase = createClient(await cookies());
  const [{ data: profiles }, { data: { user } }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at"),
    supabase.auth.getUser(),
  ]);

  return (
    <div>
      <h2 className="font-bold uppercase tracking-widest mb-4">
        Users ({profiles?.length ?? 0})
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        New signups are customers by default. Roles are assigned here — never at
        registration. You cannot change your own role.
      </p>

      <table className="w-full text-sm border divide-y">
        <thead className="bg-neutral-100 text-left">
          <tr>
            <th className="p-2">Email</th>
            <th className="p-2">Registered</th>
            <th className="p-2">Role</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {(profiles ?? []).map((p) => (
            <tr key={p.id}>
              <td className="p-2">
                {p.email} {p.id === user?.id && <span className="text-xs text-gray-500">(you)</span>}
              </td>
              <td className="p-2">{new Date(p.created_at).toLocaleDateString()}</td>
              <td className="p-2">
                <span className="text-xs uppercase tracking-widest rounded-full bg-neutral-100 px-3 py-1">
                  {p.role}
                </span>
              </td>
              <td className="p-2 text-right">
                {p.id !== user?.id && (
                  <form action={updateUserRole} className="flex items-center justify-end gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <select name="role" defaultValue={p.role} className="rounded-md border px-2 py-1 text-sm h-8">
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                    <Button size="sm" variant="outline">Update</Button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
