"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; text: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I'm the LUKIN assistant. Ask me about our products, your orders, shipping or returns.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", text: data.text ?? data.error ?? "Something went wrong." },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", text: "Network error — please try again." },
      ]);
    }
    setBusy(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
            <p className="text-sm font-bold uppercase tracking-widest">LUKIN Support</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "self-end bg-black text-white"
                    : "self-start bg-neutral-100"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-gray-500">
                Typing…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              maxLength={1000}
              className="h-9 flex-1 rounded-md border px-3 text-sm outline-none focus:border-black"
            />
            <Button size="icon" className="h-9 w-9" disabled={busy || !input.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          size="icon"
          className="h-13 w-13 rounded-full shadow-lg"
          onClick={() => setOpen(!open)}
          aria-label="Customer support chat"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
}
