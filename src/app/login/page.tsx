"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    
    const next = new URLSearchParams(window.location.search).get("next") ?? "/profile";

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push(next);
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setMessage("Check your email to confirm your account, then log in.");
      } else {
        router.push(next);
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-32">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-center mb-4">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
        </Button>

        <button
          type="button"
          className="text-sm text-gray-500 hover:text-black underline"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
        >
          {mode === "login"
            ? "No account? Create one"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
