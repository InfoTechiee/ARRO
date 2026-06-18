import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { filterAndScoreTasks } from "@/lib/rules-engine";
import type { Task, UserTask, TaskRule, TaskDependency, JourneyStage, UserGoal } from "@/types";
import { PriorityBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getEstimatedTimeLabel, getCategoryEmoji, cn } from "@/lib/utils";

export default async function JourneyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: stagesData },
    { data: tasksData },
    { data: userTasksData },
    { data: taskRulesData },
    { data: depsData },
    { data: goalsData },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("journey_stages").select("*").order("sort_order"),
    supabase.from("tasks").select("*").eq("active", true),
    supabase.from("user_tasks").select("*").eq("user_id", user.id),
    supabase.from("task_rules").select("*"),
    supabase.from("task_dependencies").select("*"),
    supabase.from("user_goals").select("*").eq("user_id", user.id),
  ]);

  if (!profile) redirect("/onboarding");

  const stages = (stagesData || []) as JourneyStage[];
  const tasks = (tasksData || []) as Task[];
  const userTasks = (userTasksData || []) as UserTask[];
  const taskRules = (taskRulesData || []) as TaskRule[];
  const deps = (depsData || []) as TaskDependency[];
  const goals = ((goalsData || []).map((g: { goal: string }) => g.goal)) as UserGoal[];

  const currentStage = stages.find((s) => s.id === profile.arrival_stage_id);
  const currentStageCode = currentStage?.stage_code || "STAGE-01";
  const currentStageOrder = parseInt(currentStageCode.replace("STAGE-", ""), 10);

  const scoredTasks = filterAndScoreTasks(
    tasks, userTasks, taskRules, deps, stages, profile, goals, currentStageCode
  );

  // Group tasks by stage
  const tasksByStage: Record<string, typeof scoredTasks> = {};
  for (const st of scoredTasks) {
    const taskStage = stages.find((s) => s.id === st.task?.stage_id);
    const code = taskStage?.stage_code || "STAGE-01";
    if (!tasksByStage[code]) tasksByStage[code] = [];
    tasksByStage[code].push(st);
  }

  // Determine which stages to show (completed + current + next 2)
  const visibleStages = stages.filter((s) => {
    const order = parseInt(s.stage_code.replace("STAGE-", ""), 10);
    return order <= currentStageOrder + 1;
  });

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-text-primary">Your Journey</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Track your progress through your Ontario settlement
        </p>
      </div>

      {/* Stage map — vertical milestone progression */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Stage Map</h2>
        <div className="relative">
          {stages.map((stage, i) => {
            const order = parseInt(stage.stage_code.replace("STAGE-", ""), 10);
            const isCurrent = stage.stage_code === currentStageCode;
            const isCompleted = order < currentStageOrder;
            const isFuture = order > currentStageOrder;
            const stageTasks = tasksByStage[stage.stage_code] || [];
            const completedCount = stageTasks.filter((t) => t.status === "completed").length;
            const totalCount = stageTasks.length;

            return (
              <div key={stage.id} className="flex gap-4 mb-2">
                {/* Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all z-10",
                    isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : isCurrent
                      ? "bg-white border-emerald-600 text-emerald-600 shadow-green-glow"
                      : "bg-white border-border-light text-text-muted"
                  )}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-border-medium" />
                    )}
                  </div>
                  {i < stages.length - 1 && (
                    <div className={cn(
                      "w-0.5 flex-1 min-h-[32px] mt-1",
                      isCompleted ? "bg-emerald-200" : "bg-border-light"
                    )} />
                  )}
                </div>

                {/* Stage content */}
                <div className={cn(
                  "flex-1 min-w-0 pb-4",
                  isFuture && "opacity-50"
                )}>
                  <div className={cn(
                    "rounded-2xl border transition-all",
                    isCurrent
                      ? "border-emerald-200 bg-emerald-50/50"
                      : isCompleted
                      ? "border-border-light bg-white"
                      : "border-border-light bg-white/50"
                  )}>
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          isCurrent ? "text-emerald-600" : "text-text-muted"
                        )}>
                          {isCompleted ? "✓ Completed" : isCurrent ? "● Current" : "○ Upcoming"}
                        </span>
                      </div>
                      <h3 className={cn(
                        "font-bold",
                        isCurrent ? "text-emerald-700" : "text-text-primary"
                      )}>
                        {stage.name}
                      </h3>
                      {(isCurrent || isCompleted) && totalCount > 0 && (
                        <p className="text-xs text-text-muted mt-1">
                          {completedCount} / {totalCount} tasks complete
                        </p>
                      )}
                    </div>

                    {/* Current stage tasks */}
                    {isCurrent && (
                      <div className="border-t border-emerald-100 px-4 pb-3 pt-3 space-y-2">
                        {["P1", "P2", "P3"].map((priority) => {
                          const pTasks = stageTasks.filter((t) => t.task?.priority === priority && t.status !== "completed");
                          if (!pTasks.length) return null;
                          return (
                            <div key={priority}>
                              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                {priority === "P1" ? "Critical" : priority === "P2" ? "Important" : "Helpful"}
                              </p>
                              {pTasks.slice(0, 3).map((st) => (
                                <Link
                                  key={st.id}
                                  href={`/journey/task/${st.task_id}`}
                                  className="flex items-center gap-3 py-2 hover:bg-emerald-50/50 rounded-xl px-2 transition-colors group"
                                >
                                  <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all",
                                    st.status === "completed"
                                      ? "bg-emerald-600 border-emerald-600"
                                      : "border-border-medium group-hover:border-emerald-400"
                                  )}>
                                    {st.status === "completed" && (
                                      <svg className="w-full h-full p-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-sm text-text-primary line-clamp-1 flex-1">
                                    {st.task?.title}
                                  </span>
                                  {st.task?.estimated_minutes && (
                                    <span className="text-xs text-text-muted flex-shrink-0">
                                      {getEstimatedTimeLabel(st.task.estimated_minutes)}
                                    </span>
                                  )}
                                </Link>
                              ))}
                              {pTasks.length > 3 && (
                                <p className="text-xs text-emerald-600 px-2 mt-1 font-medium">+{pTasks.length - 3} more</p>
                              )}
                            </div>
                          );
                        })}

                        {/* Completed tasks in current stage */}
                        {stageTasks.filter((t) => t.status === "completed").length > 0 && (
                          <div className="pt-1">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Completed</p>
                            {stageTasks.filter((t) => t.status === "completed").map((st) => (
                              <div key={st.id} className="flex items-center gap-3 py-1.5 px-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-emerald-600 flex-shrink-0">
                                  <svg className="w-full h-full p-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-sm text-text-muted line-through line-clamp-1">{st.task?.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All tasks for current stage — full list */}
      <div>
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
          All tasks — {currentStage?.name}
        </h2>
        <div className="space-y-3">
          {(tasksByStage[currentStageCode] || []).map((st) => (
            <Link key={st.id} href={`/journey/task/${st.task_id}`}>
              <Card hoverable padding="sm" className={cn(
                "flex items-center gap-4",
                st.status === "completed" && "opacity-60"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl",
                  st.status === "completed"
                    ? "bg-emerald-50"
                    : "bg-slate-50"
                )}>
                  {st.status === "completed" ? (
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    getCategoryEmoji(st.task?.category || "")
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {st.task?.priority && <PriorityBadge priority={st.task.priority} />}
                    {st.softPrereqTitle && (
                      <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                        After: {st.softPrereqTitle.slice(0, 20)}…
                      </span>
                    )}
                  </div>
                  <p className={cn(
                    "font-semibold text-sm line-clamp-2",
                    st.status === "completed" ? "text-text-muted line-through" : "text-text-primary"
                  )}>
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
      </div>
    </div>
  );
}
