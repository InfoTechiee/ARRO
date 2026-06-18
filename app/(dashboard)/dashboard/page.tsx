import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { filterAndScoreTasks, getMissingOpportunities, computeProgressPercent } from "@/lib/rules-engine";
import type { Task, UserTask, TaskRule, TaskDependency, JourneyStage, School, UserGoal } from "@/types";
import ProgressRing from "@/components/ui/ProgressRing";
import { PriorityBadge, Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getGreeting, getEstimatedTimeLabel, formatRelativeDate, getCategoryEmoji } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Load all data in parallel
  const [
    { data: profile },
    { data: stagesData },
    { data: tasksData },
    { data: userTasksData },
    { data: taskRulesData },
    { data: depsData },
    { data: goalsData },
    { data: deadlinesData },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*, school:schools(*)").eq("user_id", user.id).single(),
    supabase.from("journey_stages").select("*").order("sort_order"),
    supabase.from("tasks").select("*").eq("active", true),
    supabase.from("user_tasks").select("*").eq("user_id", user.id),
    supabase.from("task_rules").select("*"),
    supabase.from("task_dependencies").select("*"),
    supabase.from("user_goals").select("*").eq("user_id", user.id),
    supabase.from("user_deadlines")
      .select("*, deadline:deadlines(*)")
      .eq("user_id", user.id)
      .eq("status", "upcoming")
      .order("due_date", { ascending: true })
      .limit(3),
  ]);

  if (!profile) redirect("/onboarding");

  const stages = (stagesData || []) as JourneyStage[];
  const tasks = (tasksData || []) as Task[];
  const userTasks = (userTasksData || []) as UserTask[];
  const taskRules = (taskRulesData || []) as TaskRule[];
  const deps = (depsData || []) as TaskDependency[];
  const goals = ((goalsData || []).map((g: { goal: string }) => g.goal)) as UserGoal[];

  // Get current stage
  const currentStage = stages.find((s) => s.id === profile.arrival_stage_id);
  const currentStageCode = currentStage?.stage_code || "STAGE-01";

  // Run rules engine
  const scoredTasks = filterAndScoreTasks(
    tasks, userTasks, taskRules, deps, stages, profile, goals, currentStageCode
  );

  const progressPercent = computeProgressPercent(userTasks);
  const recommended = scoredTasks.filter((t) => t.status === "not_started").slice(0, 3);
  const missing = getMissingOpportunities(scoredTasks, currentStageCode, 3);

  const school = profile.school as School | null;
  const totalTasks = scoredTasks.length;
  const completedCount = scoredTasks.filter((t) => t.status === "completed").length;

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary leading-tight">
            {getGreeting(profile.first_name)}
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {school?.name || "Ontario"} · {currentStage?.name || "Getting started"}
          </p>
        </div>
        <Link href="/profile" className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-float hover:shadow-lg transition-shadow">
          {profile.first_name.charAt(0).toUpperCase()}
        </Link>
      </div>

      {/* Progress Overview */}
      <Card className="gradient-card">
        <div className="flex items-center gap-6">
          <ProgressRing
            percent={progressPercent}
            size={100}
            strokeWidth={9}
            label="complete"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-text-primary mb-1">Journey Progress</h2>
            <p className="text-sm text-text-secondary mb-3">
              {completedCount} of {totalTasks} tasks complete
            </p>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {currentStage?.name || "Stage 1"}
            </div>
          </div>
        </div>
      </Card>

      {/* Recommended Next Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-text-primary">Recommended next steps</h2>
          <Link href="/journey" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
            View all →
          </Link>
        </div>
        {recommended.length === 0 ? (
          <Card>
            <p className="text-text-secondary text-sm text-center py-4">
              🎉 You&apos;re all caught up! Check the Journey tab for upcoming tasks.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recommended.map((st, i) => (
              <Link key={st.id} href={`/journey/task/${st.task_id}`}>
                <Card hoverable className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">
                    {getCategoryEmoji(st.task?.category || "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-text-muted">#{i + 1}</span>
                      {st.task?.priority && <PriorityBadge priority={st.task.priority} />}
                    </div>
                    <p className="font-semibold text-text-primary text-sm leading-snug line-clamp-2">
                      {st.task?.title}
                    </p>
                    {st.task?.estimated_minutes && (
                      <p className="text-xs text-text-muted mt-0.5">
                        ⏱ {getEstimatedTimeLabel(st.task.estimated_minutes)}
                      </p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </Link>
            ))}
          </div>
        )}
        <Link href="/journey">
          <div className="mt-3 w-full py-3 text-center text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors">
            Continue Journey →
          </div>
        </Link>
      </div>

      {/* Upcoming Deadlines */}
      {deadlinesData && deadlinesData.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-text-primary">Upcoming deadlines</h2>
            <Link href="/journey#deadlines" className="text-xs font-semibold text-emerald-600">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {deadlinesData.map((ud: { id: string; due_date: string; deadline?: { title: string; category: string; description: string } }) => (
              <div key={ud.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-border-light">
                <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary line-clamp-1">{ud.deadline?.title}</p>
                  <p className="text-xs text-text-muted">{formatRelativeDate(ud.due_date)}</p>
                </div>
                <Badge variant="warning">{ud.deadline?.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Opportunities */}
      {missing.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-text-primary">You may be missing</h2>
            <Link href="/resources?filter=opportunities" className="text-xs font-semibold text-emerald-600">
              View all →
            </Link>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
            {missing.map((st) => (
              <Link key={st.id} href={`/journey/task/${st.task_id}`} className="flex items-center gap-3 group">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-warning" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                  {st.task?.title}
                </p>
                <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* School Highlights */}
      {school && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-text-primary">School spotlight</h2>
            <Link href={`/resources?school=true`} className="text-xs font-semibold text-emerald-600">
              View all →
            </Link>
          </div>
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                🏫
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-0.5">{school.name}</h3>
                <p className="text-emerald-100 text-sm mb-3">
                  Resources and services specific to your institution
                </p>
                <Link
                  href="/resources?filter=school"
                  className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                >
                  View school resources →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="font-bold text-text-primary mb-3">Quick actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/ai", icon: "🤖", label: "Ask AI" },
            { href: "/journey", icon: "🗺️", label: "Roadmap" },
            { href: "/resources", icon: "📚", label: "Resources" },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 bg-white border border-border-light rounded-2xl py-4 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors card-lift"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-text-secondary">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
