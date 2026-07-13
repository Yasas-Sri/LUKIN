// Row types matching supabase/seed.sql
export interface Category {
  id: number;
  slug: string;
  name: string;
  group: "men" | "women" | "accessories";
  image: string | null;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string | null;
  phone: string | null;
  salary: number;
  hired_at: string;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  discount_percentage: number;
  rating: number | null;
  stock: number;
  brand: string | null;
  thumbnail: string;
  images: string[];
  category_id: number;
}
