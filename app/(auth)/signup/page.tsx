"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup() {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true); setError("");
    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    // Redirect to onboarding
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-3xl shadow-card border border-border-light p-8 animate-slide-up">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Create your guide</h1>
      <p className="text-text-secondary text-sm mb-8">
        Free to use. Takes 3 minutes.
      </p>

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
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-border-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all bg-offwhite"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            placeholder="At least 8 characters"
            className="w-full px-4 py-3 rounded-xl border border-border-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all bg-offwhite"
          />
        </div>
        <Button onClick={handleSignup} loading={loading} fullWidth size="lg" className="mt-2">
          Create my free guide
        </Button>
      </div>

      <p className="text-xs text-text-muted text-center mt-4 leading-relaxed">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-text-secondary">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-text-secondary">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
