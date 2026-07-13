import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// ponytail: Gemini REST via fetch — no SDK dependency needed for one endpoint
const MODEL = "gemini-3.5-flash";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY)
    return NextResponse.json(
      { error: "Chatbot is not configured (missing GEMINI_API_KEY)." },
      { status: 500 }
    );

  const body = await req.json().catch(() => null);
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0)
    return NextResponse.json({ error: "No message." }, { status: 400 });

  // trust boundary: cap history length and message size before forwarding
  const history = messages.slice(-10).map((m) => ({
    role: m?.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m?.text ?? "").slice(0, 1000) }],
  }));

  // ground the bot in live store data (and the customer's own orders via RLS)
  const supabase = createClient(await cookies());
  const [{ data: products }, { data: { user } }] = await Promise.all([
    supabase.from("products").select("title, price, stock, category:categories(name)").order("title"),
    supabase.auth.getUser(),
  ]);

  const catalogue = (
    (products ?? []) as unknown as
      { title: string; price: number; stock: number; category: { name: string } | null }[]
  )
    .map((p) => `${p.title} — $${p.price} (${p.category?.name ?? "Other"}, ${p.stock > 0 ? `${p.stock} in stock` : "OUT OF STOCK"})`)
    .join("\n");

  let orderContext = "The customer is not signed in. If they ask about their orders, ask them to sign in first.";
  if (user) {
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total, status, payment_method, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    orderContext =
      `The customer is signed in as ${user.email}. Their recent orders:\n` +
      ((orders ?? [])
        .map(
          (o) =>
            `Order #${o.id}: $${o.total}, status ${o.status}, paid by ${o.payment_method === "card" ? "card" : "cash on delivery"}, placed ${new Date(o.created_at).toLocaleDateString()}`
        )
        .join("\n") || "(no orders yet)");
  }

  const systemPrompt = `You are the friendly customer support assistant for LUKIN, an online clothing store.
Answer briefly (2-4 sentences), in plain text without markdown formatting.
Only answer questions related to the store, its products, and the customer's orders — politely decline anything else.

Store policies:
- Payment: cash on delivery, or card at checkout (secure payment via Stripe).
- Free shipping on orders over $100; otherwise standard delivery in 3-5 working days.
- Returns accepted within 14 days if unworn, with the invoice (available on the customer's profile).
- Order statuses: pending, confirmed, shipped, delivered, cancelled. Order history is on the profile page.

${orderContext}

Current product catalogue:
${catalogue}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: history,
      }),
    }
  );
  const data = await res.json().catch(() => null);
  if (!res.ok)
    return NextResponse.json(
      { error: data?.error?.message ?? "The assistant is unavailable right now." },
      { status: 502 }
    );

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") || "Sorry, I couldn't come up with an answer — please try rephrasing.";
  return NextResponse.json({ text });
}
