import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Navigationbar } from "@/components/Navigationbar";
import { HomeHeader } from "@/components/Homeheader";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import type { Category } from "@/lib/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand — Clothing Store",
  description: "Clothing brand e-commerce store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient(await cookies());
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

       <header className="fixed top-0 left-0 right-0 z-50 bg-white">
          <HomeHeader />
          <Navigationbar categories={(categories ?? []) as Category[]} />
        </header>
        {children}

        <Footer />
      </body>
    </html>
  );
}
