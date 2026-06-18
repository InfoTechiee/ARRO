import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PriorityBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getEstimatedTimeLabel, getCategoryEmoji } from "@/lib/utils";
import TaskActionButtons from "./TaskActionButtons";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: task } = await supabase
    .from("tasks")
    .select("*, stage:journey_stages(*)")
    .eq("id", id)
    .single();

  if (!task) notFound();

  const [{ data: userTask }, { data: deps }] = await Promise.all([
    supabase.from("user_tasks").select("*").eq("user_id", user.id).eq("task_id", id).single(),
    supabase.from("task_dependencies").select("depends_on_task_code, dependency_type").eq("task_code", task.task_code),
  ]);

  const currentStatus = userTask?.status || "not_started";
  const stage = task.stage as { name: string; stage_code: string } | null;

  // Get related resources by category match
  const { data: relatedResources } = await supabase
    .from("resources")
    .select("*, category:resource_categories(name)")
    .limit(4);

  const SUGGESTED_QUESTIONS = [
    `How do I complete "${task.title}"?`,
    `Why is "${task.title}" important for international students?`,
    `What documents do I need for this?`,
    `How long does this take?`,
  ];

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6">
      {/* Back button */}
      <Link
        href="/journey"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary font-medium mb-5 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Journey
      </Link>

      {/* Task Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">
            {getCategoryEmoji(task.category)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {task.priority && <PriorityBadge priority={task.priority} />}
              <span className="text-xs text-text-muted font-medium">{task.task_code}</span>
            </div>
            <p className="text-xs text-text-muted">{stage?.name} · {task.category}</p>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary leading-tight">
          {task.title}
        </h1>
        {task.estimated_minutes && (
          <p className="text-sm text-text-muted mt-1.5">
            ⏱ Estimated: {getEstimatedTimeLabel(task.estimated_minutes)}
          </p>
        )}
      </div>

      {/* Status card */}
      <TaskActionButtons taskId={id} currentStatus={currentStatus} userId={user.id} />

      {/* Why it matters */}
      {task.why_it_matters && (
        <Card className="mb-4">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <h2 className="font-bold text-text-primary mb-1.5">Why this matters</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{task.why_it_matters}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Description */}
      {task.description && (
        <Card className="mb-4">
          <h2 className="font-bold text-text-primary mb-2">What this involves</h2>
          <p className="text-text-secondary text-sm leading-relaxed">{task.description}</p>
        </Card>
      )}

      {/* Prerequisites */}
      {deps && deps.length > 0 && (
        <Card className="mb-4">
          <h2 className="font-bold text-text-primary mb-3">Prerequisites</h2>
          <div className="space-y-2">
            {deps.map((dep: { depends_on_task_code: string; dependency_type: string }) => (
              <div
                key={dep.depends_on_task_code}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-light bg-slate-50"
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  dep.dependency_type === "HARD"
                    ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-600"
                }`}>
                  {dep.dependency_type}
                </span>
                <span className="text-sm text-text-primary flex-1 font-mono text-xs">{dep.depends_on_task_code}</span>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Related Resources */}
      {relatedResources && relatedResources.length > 0 && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-text-primary">Recommended resources</h2>
            <Link href="/resources" className="text-xs text-emerald-600 font-semibold">
              All →
            </Link>
          </div>
          <div className="space-y-2">
            {relatedResources.slice(0, 3).map((res: { id: string; title: string; description: string; source_name: string; source_url: string }) => (
              <a
                key={res.id}
                href={res.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-border-light hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {res.title}
                  </p>
                  <p className="text-xs text-text-muted">{res.source_name}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Ask AI section */}
      <Card className="mb-4 bg-gradient-to-br from-slate-800 to-slate-900 border-0">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div className="flex-1">
            <h2 className="font-bold text-white mb-1">Ask your AI guide</h2>
            <p className="text-slate-300 text-sm mb-4">
              Get personalized answers about this task based on your profile.
            </p>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.slice(0, 2).map((q, i) => (
                <Link
                  key={i}
                  href={`/ai?q=${encodeURIComponent(q)}`}
                  className="block text-sm text-slate-200 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors truncate"
                >
                  &ldquo;{q}&rdquo;
                </Link>
              ))}
            </div>
            <Link
              href="/ai"
              className="inline-flex items-center gap-1.5 mt-4 bg-white text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Open AI Guide →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
