export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  // If user is logged in, redirect to dashboard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border-light">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-emerald flex items-center justify-center shadow-float">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="text-lg font-bold text-text-primary">Arro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-float"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Built for international students in Ontario
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
            Your personalized
            <span className="text-emerald-600 block">Ontario roadmap.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Never miss an important step during your first years in Ontario.
            Arro gives you a step-by-step guide — personalized to your school,
            stage, and goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white text-base font-semibold px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-float hover:shadow-lg active:scale-[0.98]"
            >
              Create your free guide
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-text-primary text-base font-semibold px-8 py-4 rounded-2xl border border-border-medium hover:bg-slate-50 transition-all"
            >
              Sign in
            </Link>
          </div>

          <p className="text-sm text-text-muted mt-4">
            Free to use · No credit card required · Takes 3 minutes
          </p>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-8 bg-white border-y border-border-light">
        <div className="max-w-4xl mx-auto px-5">
          <p className="text-center text-sm text-text-muted mb-4 font-medium uppercase tracking-wider">Personalized for students at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-text-secondary font-semibold text-sm">
            {["York University", "Seneca Polytechnic", "George Brown College"].map((s) => (
              <span key={s} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary">
              Your roadmap in 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Tell us about yourself",
                desc: "Answer 7 quick questions about your school, arrival date, goals, and situation. Takes under 3 minutes.",
                icon: "📝",
              },
              {
                step: "02",
                title: "Get your personalized roadmap",
                desc: "We generate a step-by-step guide specific to your stage, school, and immigration status.",
                icon: "🗺️",
              },
              {
                step: "03",
                title: "Never miss a step",
                desc: "Track tasks, get deadline reminders, discover missing opportunities, and ask our AI anything.",
                icon: "✅",
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-card border border-border-light">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Why students use Arro</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary">
              Everything in one place
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🎯", title: "Personalized roadmap", desc: "Not a generic checklist. Your tasks are filtered by school, immigration status, stage, and goals." },
              { icon: "⏰", title: "Deadline tracking", desc: "Tax filing, study permit renewals, PGWP windows — never miss a critical date again." },
              { icon: "🔍", title: "Missing opportunities", desc: "Discover important programs and resources that similar students commonly overlook." },
              { icon: "🤖", title: "AI guide", desc: "Ask anything — our AI answers with context from your profile and trusted Canadian sources." },
              { icon: "🏫", title: "School-specific content", desc: "Resources, tasks, and guidance specific to your institution." },
              { icon: "📱", title: "Mobile-first", desc: "Designed for your phone. Track your progress anywhere, anytime." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl border border-border-light hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-emerald-600 rounded-3xl p-10 shadow-float">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Start your journey today
            </h2>
            <p className="text-emerald-100 mb-8">
              Free to use. No credit card. Get your personalized Ontario roadmap in minutes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 text-base font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-colors"
            >
              Create your free guide
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light py-8 px-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-emerald flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-text-primary text-sm">Arro</span>
          </div>
          <p className="text-xs text-text-muted text-center">
            Helping international students settle in Ontario with confidence.
          </p>
          <div className="flex gap-4 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-text-secondary">Privacy</Link>
            <Link href="/terms" className="hover:text-text-secondary">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
