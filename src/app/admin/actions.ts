"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function saveProduct(formData: FormData) {
  const supabase = createClient(await cookies());
  const id = formData.get("id")?.toString();
  const images = formData
    .get("images")!.toString()
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const row = {
    title: formData.get("title")!.toString().trim(),
    description: formData.get("description")?.toString().trim() || null,
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock") || 0),
    brand: formData.get("brand")?.toString().trim() || null,
    category_id: Number(formData.get("category_id")),
    thumbnail: formData.get("thumbnail")!.toString().trim(),
    images: images.length ? images : [formData.get("thumbnail")!.toString().trim()],
  };

  const { error } = id
    ? await supabase.from("products").update(row).eq("id", Number(id))
    : await supabase.from("products").insert(row);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", Number(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}

export async function updateUserRole(formData: FormData) {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // ponytail: block self-demotion so the store can't lock itself out of admin
  if (user?.id === formData.get("id")?.toString())
    throw new Error("You cannot change your own role.");

  const { error } = await supabase
    .from("profiles")
    .update({ role: formData.get("role")!.toString() })
    .eq("id", formData.get("id")!.toString());
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function addEmployee(formData: FormData) {
  const supabase = createClient(await cookies());
  const { error } = await supabase.from("employees").insert({
    name: formData.get("name")!.toString().trim(),
    position: formData.get("position")!.toString().trim(),
    email: formData.get("email")?.toString().trim() || null,
    phone: formData.get("phone")?.toString().trim() || null,
    salary: Number(formData.get("salary") || 0),
    hired_at: formData.get("hired_at")?.toString() || new Date().toISOString().slice(0, 10),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/employees");
}

export async function updateEmployeeSalary(formData: FormData) {
  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("employees")
    .update({ salary: Number(formData.get("salary") || 0) })
    .eq("id", Number(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/employees");
}

export async function deleteEmployee(formData: FormData) {
  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", Number(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/employees");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("orders")
    .update({ status: formData.get("status")!.toString() })
    .eq("id", Number(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
