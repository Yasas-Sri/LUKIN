import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrintButton } from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import type { Employee } from "@/lib/types";
import { addEmployee, deleteEmployee, updateEmployeeSalary } from "../actions";

export default async function AdminEmployees() {
  const supabase = createClient(await cookies());
  const { data } = await supabase.from("employees").select("*").order("name");
  const employees = (data ?? []) as Employee[];
  const payroll = employees.reduce((s, e) => s + Number(e.salary), 0);

  return (
    <div>
      {/* heading only the printed/PDF report shows */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          LUKIN — Employee &amp; Payroll Report
        </h1>
        <p className="text-sm text-gray-500">Generated {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold uppercase tracking-widest">
          Employees ({employees.length})
        </h2>
        <PrintButton label="Generate Payroll Report (PDF)" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Staff count</p>
          <p className="text-2xl font-bold mt-1">{employees.length}</p>
        </div>
        <div className="border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Monthly payroll</p>
          <p className="text-2xl font-bold mt-1">${payroll.toFixed(2)}</p>
        </div>
      </div>

      <table className="w-full text-sm border divide-y">
        <thead className="bg-neutral-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Position</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Hired</th>
            <th className="p-2">Salary ($/month)</th>
            <th className="p-2 print:hidden"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((e) => (
            <tr key={e.id}>
              <td className="p-2 font-medium">{e.name}</td>
              <td className="p-2">{e.position}</td>
              <td className="p-2">
                {e.email}
                {e.phone && <span className="block text-gray-500">{e.phone}</span>}
              </td>
              <td className="p-2">{new Date(e.hired_at).toLocaleDateString()}</td>
              <td className="p-2">
                <span className="hidden print:inline">${Number(e.salary).toFixed(2)}</span>
                <form
                  action={updateEmployeeSalary}
                  className="flex items-center gap-2 print:hidden"
                >
                  <input type="hidden" name="id" value={e.id} />
                  <Input
                    type="number"
                    name="salary"
                    defaultValue={Number(e.salary)}
                    min={0}
                    step="0.01"
                    className="h-8 w-28"
                  />
                  <Button size="sm" variant="outline">Update</Button>
                </form>
              </td>
              <td className="p-2 text-right print:hidden">
                <form action={deleteEmployee}>
                  <input type="hidden" name="id" value={e.id} />
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    Remove
                  </Button>
                </form>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td className="p-2 text-gray-500" colSpan={6}>
                No employees yet — add the first one below.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t font-bold">
            <td className="p-2" colSpan={4}>Total monthly payroll</td>
            <td className="p-2" colSpan={2}>${payroll.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <section className="mt-10 print:hidden">
        <h2 className="font-bold uppercase tracking-widest mb-3">Add Employee</h2>
        <form action={addEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
          <Input name="name" placeholder="Full name" required />
          <Input name="position" placeholder="Position" required />
          <Input name="email" type="email" placeholder="Email (optional)" />
          <Input name="phone" placeholder="Phone (optional)" />
          <Input name="salary" type="number" min={0} step="0.01" placeholder="Salary $/month" required />
          <Input name="hired_at" type="date" title="Hired date" />
          <div className="md:col-span-3">
            <Button>Add Employee</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
