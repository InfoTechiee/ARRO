"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import type { UserGoal } from "@/types";
import { ARRIVAL_STAGE_OPTIONS, GOAL_OPTIONS } from "@/types";

const GOAL_EMOJIS: Record<string, string> = {
  Housing: "🏠", Jobs: "💼", Healthcare: "🏥", Banking: "🏦",
  Credit: "💳", Taxes: "📋", Immigration: "🛂", "Cost of Living": "💰",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    first_name: string;
    program_name: string;
    housing_status: string;
    employment_status: string;
    immigration_status: string;
    arrival_stage_id: string;
    study_permit_expiry: string;
    graduation_date: string;
    school?: { id: string; name: string };
    arrival_stage?: { id: string; name: string; stage_code: string };
  } | null>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");

      const [{ data: p }, { data: g }] = await Promise.all([
        supabase.from("user_profiles")
          .select("*, school:schools(id, name), arrival_stage:journey_stages(id, name, stage_code)")
          .eq("user_id", user.id).single(),
        supabase.from("user_goals").select("goal").eq("user_id", user.id),
      ]);

      if (p) setProfile(p);
      if (g) setGoals(g.map((x: { goal: UserGoal }) => x.goal));
    }
    load();
  }, []);

  async function handleSave() {
    setLoading(true); setError(""); setSaved(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("user_profiles").update({
        first_name: profile?.first_name,
        program_name: profile?.program_name,
        immigration_status: profile?.immigration_status,
        housing_status: profile?.housing_status,
        employment_status: profile?.employment_status,
        graduation_date: profile?.graduation_date || null,
        study_permit_expiry: profile?.study_permit_expiry || null,
      }).eq("user_id", user.id);

      // Update goals
      await supabase.from("user_goals").delete().eq("user_id", user.id);
      if (goals.length > 0) {
        await supabase.from("user_goals").insert(goals.map((g) => ({ user_id: user.id, goal: g })));
      }

      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-muted text-sm">Loading your profile…</div>
      </div>
    );
  }

  function update(key: string, value: string) {
    setProfile((prev) => prev ? { ...prev, [key]: value } : prev);
    setSaved(false);
  }

  function toggleGoal(goal: UserGoal) {
    const current = goals;
    if (current.includes(goal)) {
      setGoals(current.filter((g) => g !== goal));
    } else if (current.length < 3) {
      setGoals([...current, goal]);
    }
    setSaved(false);
  }

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center text-white text-2xl font-bold shadow-float flex-shrink-0">
          {profile.first_name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">{profile.first_name}</h1>
          <p className="text-text-secondary text-sm">
            {profile.school?.name || "Ontario student"} ·{" "}
            {profile.arrival_stage?.name || "Getting started"}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-3 text-sm">
          ✓ Profile saved successfully
        </div>
      )}

      {/* Personal info */}
      <Card>
        <h2 className="font-bold text-text-primary mb-4">Personal information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">First name</label>
            <input
              value={profile.first_name || ""}
              onChange={(e) => update("first_name", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border-medium text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-offwhite"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Email address</label>
            <input
              value={email}
              disabled
              className="w-full px-3 py-2.5 rounded-xl border border-border-light text-text-muted text-sm bg-slate-50 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Program / field of study</label>
            <input
              value={profile.program_name || ""}
              onChange={(e) => update("program_name", e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full px-3 py-2.5 rounded-xl border border-border-medium text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-offwhite"
            />
          </div>
        </div>
      </Card>

      {/* Journey info */}
      <Card>
        <h2 className="font-bold text-text-primary mb-4">Journey stage</h2>
        <div className="space-y-3">
          {ARRIVAL_STAGE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="stage"
                checked={profile.arrival_stage?.stage_code === opt.value}
                onChange={() => {}}
                className="mt-1 accent-emerald-600 flex-shrink-0"
                disabled // Stage changes require re-running the rules engine — shown as info only
              />
              <div>
                <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                <p className="text-xs text-text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
          <p className="text-xs text-text-muted mt-2">
            To change your stage, contact support or re-complete onboarding.
          </p>
        </div>
      </Card>

      {/* Immigration */}
      <Card>
        <h2 className="font-bold text-text-primary mb-4">Immigration status</h2>
        <div className="space-y-2">
          {[
            "International Student / Study Permit",
            "Permanent Resident",
            "Protected Person",
            "Canadian Citizen",
          ].map((opt) => (
            <button
              key={opt}
              onClick={() => update("immigration_status", opt)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                profile.immigration_status === opt
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-border-light bg-white text-text-secondary hover:border-border-medium"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {(profile.immigration_status === "International Student / Study Permit") && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Study permit expiry (optional)
            </label>
            <input
              type="date"
              value={profile.study_permit_expiry || ""}
              onChange={(e) => update("study_permit_expiry", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border-medium text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-offwhite"
            />
            <p className="text-xs text-text-muted mt-1">Used to set your study permit renewal reminder</p>
          </div>
        )}
        {(profile.immigration_status === "Permanent Resident" || profile.immigration_status === "Protected Person") && (
          <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800">
            ✓ You may now be eligible for OSAP — Ontario&apos;s student financial assistance program. Check the Resources tab for details.
          </div>
        )}
      </Card>

      {/* Goals */}
      <Card>
        <h2 className="font-bold text-text-primary mb-1">Your goals</h2>
        <p className="text-xs text-text-muted mb-4">Choose up to 3 — this personalizes your roadmap</p>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((goal) => {
            const selected = goals.includes(goal);
            const disabled = !selected && goals.length >= 3;
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                disabled={disabled}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  selected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : disabled
                    ? "border-border-light bg-slate-50 text-text-muted opacity-50 cursor-not-allowed"
                    : "border-border-light bg-white text-text-secondary hover:border-border-medium"
                }`}
              >
                <span>{GOAL_EMOJIS[goal]}</span>
                <span className="flex-1 text-left">{goal}</span>
                {selected && <span className="text-emerald-600">✓</span>}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Graduation date */}
      <Card>
        <h2 className="font-bold text-text-primary mb-4">Graduation (optional)</h2>
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Expected graduation date</label>
          <input
            type="date"
            value={profile.graduation_date || ""}
            onChange={(e) => update("graduation_date", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border-medium text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-offwhite"
          />
          <p className="text-xs text-text-muted mt-1">Used to surface PGWP application reminders at the right time</p>
        </div>
      </Card>

      {/* Save button */}
      <Button onClick={handleSave} loading={loading} fullWidth size="lg">
        Save changes
      </Button>

      {/* Settings link */}
      <div className="border-t border-border-light pt-4 space-y-2">
        <Link href="/settings" className="flex items-center gap-3 px-1 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings & Privacy
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-1 py-2 text-sm text-danger hover:text-red-700 transition-colors w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}
