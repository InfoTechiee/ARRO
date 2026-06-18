"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { ARRIVAL_STAGE_OPTIONS, GOAL_OPTIONS, type OnboardingData, type UserGoal } from "@/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 7;

const HOUSING_OPTIONS = [
  "On-campus residence",
  "Off-campus rental",
  "Homestay",
  "Temporary / Hotel",
  "Living with family/friends",
  "Not arranged yet",
];

const EMPLOYMENT_OPTIONS = [
  "Not working",
  "Looking for work",
  "Working part-time",
  "Working full-time",
  "Self-employed",
];

const IMMIGRATION_OPTIONS = [
  "International Student / Study Permit",
  "Permanent Resident",
  "Protected Person",
  "Canadian Citizen",
];

const GOAL_EMOJIS: Record<string, string> = {
  Housing: "🏠",
  Jobs: "💼",
  Healthcare: "🏥",
  Banking: "🏦",
  Credit: "💳",
  Taxes: "📋",
  Immigration: "🛂",
  "Cost of Living": "💰",
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    firstName: "",
    schoolId: "",
    programName: "",
    arrivalStageCode: "",
    arrivalDate: "",
    housingStatus: "",
    employmentStatus: "",
    goals: [],
    immigrationStatus: "",
  });
  const [schools, setSchools] = useState<{ id: string; name: string; launch_phase: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadSchools() {
      const { data: sc } = await supabase
        .from("schools")
        .select("id, name, launch_phase")
        .eq("active", true)
        .order("launch_phase", { ascending: true })
        .order("name");
      if (sc) setSchools(sc);
    }
    loadSchools();
  }, []);

  function updateData(updates: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...updates }));
    setError("");
  }

  function toggleGoal(goal: UserGoal) {
    const current = data.goals;
    if (current.includes(goal)) {
      updateData({ goals: current.filter((g) => g !== goal) });
    } else if (current.length < 3) {
      updateData({ goals: [...current, goal] });
    }
  }

  function validateStep(): boolean {
    switch (step) {
      case 2: return !!data.firstName && !!data.schoolId;
      case 3: return !!data.arrivalStageCode;
      case 4: return !!data.housingStatus && !!data.employmentStatus;
      case 5: return !!data.immigrationStatus && data.goals.length > 0;
      default: return true;
    }
  }

  function next() {
    if (!validateStep()) {
      setError("Please complete all required fields before continuing.");
      return;
    }
    setError("");
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleSubmit();
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Get stage id from stage_code
      const { data: stage } = await supabase
        .from("journey_stages")
        .select("id")
        .eq("stage_code", data.arrivalStageCode)
        .single();

      // Create user profile
      const { error: profileError } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        first_name: data.firstName,
        school_id: data.schoolId || null,
        program_name: data.programName || null,
        immigration_status: data.immigrationStatus || null,
        arrival_stage_id: stage?.id || null,
        arrival_date: data.arrivalDate || null,
        housing_status: data.housingStatus || null,
        employment_status: data.employmentStatus || null,
      });

      if (profileError) throw profileError;

      // Save goals
      await supabase.from("user_goals").delete().eq("user_id", user.id);
      if (data.goals.length > 0) {
        await supabase.from("user_goals").insert(
          data.goals.map((goal) => ({ user_id: user.id, goal }))
        );
      }

      // Step 6 shows loading — trigger real roadmap generation
      setStep(6);
      try {
        await fetch("/api/roadmap/generate", { method: "POST" });
      } catch {
        // Non-fatal: tasks will be generated lazily on first dashboard visit
      }
      await new Promise((r) => setTimeout(r, 1500)); // Minimum loading UX
      setStep(7);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep(5);
    } finally {
      setLoading(false);
    }
  }

  const progressPercent = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      {/* Header */}
      {step <= 5 && (
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-border-light">
          <div className="max-w-lg mx-auto px-5 py-3">
            <div className="flex items-center gap-3 mb-2">
              {step > 1 && (
                <button
                  onClick={back}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-text-muted">Step {step} of 5</span>
                  <span className="text-xs font-semibold text-emerald-600">{Math.round((step / 5) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.round((step / 5) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div className="w-full max-w-lg animate-slide-up">

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl gradient-emerald flex items-center justify-center shadow-float mx-auto mb-6">
                <span className="text-4xl font-bold text-white">A</span>
              </div>
              <h1 className="text-3xl font-extrabold text-text-primary mb-3">
                Welcome to Arro
              </h1>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Let&apos;s create your personalized Ontario student roadmap. It takes about 3 minutes.
              </p>
              <Button onClick={next} size="lg" fullWidth>
                Get started →
              </Button>
              <p className="text-xs text-text-muted mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-emerald-600 font-medium">Sign in</a>
              </p>
            </div>
          )}

          {/* Step 2: Personal info */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">About you</h2>
              <p className="text-text-secondary mb-6">Let&apos;s start with the basics.</p>

              {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">First name *</label>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => updateData({ firstName: e.target.value })}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 rounded-xl border border-border-medium bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">School *</label>
                  <select
                    value={data.schoolId}
                    onChange={(e) => updateData({ schoolId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-medium bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all appearance-none"
                  >
                    <option value="">Select your school…</option>
                    <optgroup label="Fully supported">
                      {schools.filter((s) => s.launch_phase === 1).map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="General guide available">
                      {schools.filter((s) => s.launch_phase === 2).map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Program / field of study</label>
                  <input
                    type="text"
                    value={data.programName}
                    onChange={(e) => updateData({ programName: e.target.value })}
                    placeholder="e.g. Computer Science, Nursing…"
                    className="w-full px-4 py-3 rounded-xl border border-border-medium bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Arrival info */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">Where are you in your journey?</h2>
              <p className="text-text-secondary mb-6">This determines which tasks we prioritize for you.</p>

              {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

              <div className="space-y-3">
                {ARRIVAL_STAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateData({ arrivalStageCode: option.value })}
                    className={cn(
                      "w-full text-left px-4 py-4 rounded-2xl border-2 transition-all duration-150",
                      data.arrivalStageCode === option.value
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-border-light bg-white hover:border-border-medium"
                    )}
                  >
                    <p className={cn(
                      "font-semibold text-sm",
                      data.arrivalStageCode === option.value ? "text-emerald-700" : "text-text-primary"
                    )}>
                      {option.label}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{option.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Arrival date (optional)</label>
                <input
                  type="date"
                  value={data.arrivalDate}
                  onChange={(e) => updateData({ arrivalDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border-medium bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 4: Current situation */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">Your current situation</h2>
              <p className="text-text-secondary mb-6">Helps us surface the most relevant tasks.</p>

              {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">Housing status *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {HOUSING_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateData({ housingStatus: opt as typeof data.housingStatus })}
                        className={cn(
                          "px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left",
                          data.housingStatus === opt
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-border-light bg-white text-text-secondary hover:border-border-medium"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">Employment status *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EMPLOYMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateData({ employmentStatus: opt as typeof data.employmentStatus })}
                        className={cn(
                          "px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left",
                          data.employmentStatus === opt
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-border-light bg-white text-text-secondary hover:border-border-medium"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Goals & immigration */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">Goals & status</h2>
              <p className="text-text-secondary mb-6">Almost done — this lets us personalize your roadmap completely.</p>

              {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Immigration status *</label>
                  <div className="space-y-2 mt-3">
                    {IMMIGRATION_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateData({ immigrationStatus: opt as typeof data.immigrationStatus })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left",
                          data.immigrationStatus === opt
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-border-light bg-white text-text-secondary hover:border-border-medium"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">
                    What matters most to you? *
                  </label>
                  <p className="text-xs text-text-muted mb-3">Choose up to 3 areas</p>
                  <div className="grid grid-cols-2 gap-2">
                    {GOAL_OPTIONS.map((goal) => {
                      const selected = data.goals.includes(goal);
                      const disabled = !selected && data.goals.length >= 3;
                      return (
                        <button
                          key={goal}
                          onClick={() => toggleGoal(goal)}
                          disabled={disabled}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                            selected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                              : disabled
                              ? "border-border-light bg-slate-50 text-text-muted opacity-50 cursor-not-allowed"
                              : "border-border-light bg-white text-text-secondary hover:border-border-medium"
                          )}
                        >
                          <span>{GOAL_EMOJIS[goal]}</span>
                          <span>{goal}</span>
                          {selected && <span className="ml-auto text-emerald-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Loading / Generating */}
          {step === 6 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full gradient-emerald flex items-center justify-center shadow-float mx-auto mb-6 animate-pulse-soft">
                <svg className="w-10 h-10 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-3">
                Building your roadmap…
              </h2>
              <p className="text-text-secondary">
                We&apos;re personalizing your Ontario guide based on your school, stage, and goals.
              </p>
            </div>
          )}

          {/* Step 7: Done */}
          {step === 7 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-3">
                Your roadmap is ready, {data.firstName}!
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                We&apos;ve built a personalized step-by-step guide based on your school, stage, and goals. Let&apos;s get started.
              </p>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8 text-left space-y-2">
                {[
                  "Personalized tasks for your stage",
                  "School-specific resources and guidance",
                  "Deadline tracking and reminders",
                  "AI guide available anytime",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-emerald-800">
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                fullWidth
              >
                Go to my dashboard →
              </Button>
            </div>
          )}

          {/* Navigation buttons for steps 2-5 */}
          {step >= 2 && step <= 5 && (
            <div className="mt-8">
              <Button onClick={next} loading={loading} size="lg" fullWidth>
                {step === 5 ? "Generate my roadmap" : "Continue →"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
