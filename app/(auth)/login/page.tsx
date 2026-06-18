"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-3xl shadow-card border border-border-light p-8 animate-slide-up">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back</h1>
      <p className="text-text-secondary text-sm mb-8">Sign in to your Arro account</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-border-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all bg-offwhite"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-text-primary">Password</label>
            <Link href="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Forgot?</Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-border-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all bg-offwhite"
          />
        </div>
        <Button onClick={handleLogin} loading={loading} fullWidth size="lg" className="mt-2">
          Sign in
        </Button>
      </div>

      <p className="text-center text-sm text-text-secondary mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-emerald-600 font-semibold hover:text-emerald-700">
          Create one free
        </Link>
      </p>
    </div>
  );
}
