import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function DeadlinesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const { data: deadlines } = await supabase
    .from("user_deadlines")
    .select("*, task:tasks(id, title, task_code)")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  const upcoming = (deadlines ?? []).filter((d) => d.due_date >= todayStr);
  const past = (deadlines ?? []).filter((d) => d.due_date < todayStr);

  function getDaysUntil(dateStr: string): number {
    const date = new Date(dateStr);
    const diff = date.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getUrgencyColor(dateStr: string): string {
    const days = getDaysUntil(dateStr);
    if (days <= 7) return "bg-red-50 border-red-200 text-red-800";
    if (days <= 30) return "bg-amber-50 border-amber-200 text-amber-800";
    return "bg-emerald-50 border-emerald-200 text-emerald-800";
  }

  function getUrgencyLabel(dateStr: string): string {
    const days = getDaysUntil(dateStr);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days <= 7) return `${days} days left`;
    if (days <= 30) return `${days} days`;
    return formatDate(dateStr);
  }

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/journey"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary font-medium mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Journey
        </Link>
        <h1 className="text-2xl font-extrabold text-text-primary">Deadlines</h1>
        <p className="text-text-secondary text-sm mt-1">
          Key dates for your settlement journey
        </p>
      </div>

      {/* Upcoming deadlines */}
      {upcoming.length > 0 ? (
        <div className="space-y-3 mb-8">
          <h2 className="font-bold text-text-primary text-sm uppercase tracking-wider text-text-muted">
            Upcoming
          </h2>
          {upcoming.map((deadline) => {
            const urgencyClass = getUrgencyColor(deadline.due_date);
            const label = getUrgencyLabel(deadline.due_date);
            const days = getDaysUntil(deadline.due_date);

            return (
              <div
                key={deadline.id}
                className="bg-white rounded-2xl border border-border-light p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary text-sm mb-1">
                      {deadline.title}
                    </h3>
                    {deadline.description && (
                      <p className="text-xs text-text-secondary leading-relaxed mb-2">
                        {deadline.description}
                      </p>
                    )}
                    {deadline.task && (
                      <Link
                        href={`/journey/task/${deadline.task.id}`}
                        className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                      >
                        View task →
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyClass}`}
                    >
                      {label}
                    </span>
                    {days > 0 && (
                      <span className="text-xs text-text-muted">
                        {new Date(deadline.due_date).toLocaleDateString(
                          "en-CA",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-light p-8 text-center mb-8">
          <div className="text-4xl mb-3">📅</div>
          <p className="font-semibold text-text-primary mb-1">
            No upcoming deadlines
          </p>
          <p className="text-sm text-text-secondary">
            Deadlines are generated based on your permit expiry and graduation
            dates. Update them in your Profile.
          </p>
          <Link
            href="/profile"
            className="inline-block mt-4 text-sm text-emerald-600 font-semibold hover:text-emerald-700"
          >
            Update Profile →
          </Link>
        </div>
      )}

      {/* Past deadlines */}
      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-wider text-text-muted">
            Past
          </h2>
          {past.map((deadline) => (
            <div
              key={deadline.id}
              className="bg-slate-50 rounded-2xl border border-border-light p-4 opacity-60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-secondary text-sm mb-1 line-through">
                    {deadline.title}
                  </h3>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0">
                  {new Date(deadline.due_date).toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
