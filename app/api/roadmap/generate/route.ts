import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// POST /api/roadmap/generate
// Called after onboarding completes to seed user_tasks rows
// for all tasks that pass the user's rules engine filters.
// ============================================================

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Load user profile + goals
    const { data: profile } = await supabase
      .from("user_profiles")
      .select(
        `*, 
        school:schools(id, name, launch_phase),
        arrival_stage:journey_stages!arrival_stage_id(id, stage_code, sort_order)`
      )
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const { data: userGoalsRaw } = await supabase
      .from("user_goals")
      .select("goal")
      .eq("user_id", user.id);

    const userGoals = (userGoalsRaw ?? []).map((g: { goal: string }) => g.goal);
    const userStageOrder: number =
      (profile.arrival_stage as { sort_order?: number } | null)?.sort_order ?? 1;
    const userSchoolId: string | null = profile.school_id ?? null;
    const immigrationStatus: string = profile.immigration_status ?? "";

    // 2. Load all active tasks with their rules
    const { data: allTasks } = await supabase
      .from("tasks")
      .select("id, task_code, stage_id, school_id, priority, category")
      .eq("active", true);

    if (!allTasks || allTasks.length === 0) {
      return NextResponse.json({ seeded: 0 });
    }

    const { data: allRules } = await supabase
      .from("task_rules")
      .select("task_code, rule_type, conditions, match_all");

    // 3. Load all journey stages to get their sort_order
    const { data: allStages } = await supabase
      .from("journey_stages")
      .select("id, stage_code, sort_order");

    const stageOrderMap = new Map<string, number>(
      (allStages ?? []).map((s: { id: string; sort_order: number }) => [
        s.id,
        s.sort_order,
      ])
    );

    const rulesByTaskCode = new Map<string, typeof allRules>();
    for (const rule of allRules ?? []) {
      const existing = rulesByTaskCode.get(rule.task_code) ?? [];
      existing.push(rule);
      rulesByTaskCode.set(rule.task_code, existing);
    }

    // 4. Filter tasks
    const eligibleTaskIds: string[] = [];

    for (const task of allTasks) {
      // School filter: skip school-specific tasks that don't match
      if (task.school_id && task.school_id !== userSchoolId) {
        continue;
      }

      // Stage filter: only include tasks from current stage or earlier
      const taskStageOrder = stageOrderMap.get(task.stage_id) ?? 99;
      if (taskStageOrder > userStageOrder + 2) {
        // Show tasks up to 2 stages ahead for visibility
        continue;
      }

      // Rules filter
      const taskRules = rulesByTaskCode.get(task.task_code) ?? [];
      let includeTask = true;

      for (const rule of taskRules) {
        if (rule.rule_type === "INCLUDE" || rule.rule_type === "EXCLUDE") {
          const passes = evaluateConditions(
            rule.conditions,
            rule.match_all,
            { immigrationStatus, goals: userGoals }
          );

          if (rule.rule_type === "INCLUDE" && !passes) {
            includeTask = false;
            break;
          }
          if (rule.rule_type === "EXCLUDE" && passes) {
            includeTask = false;
            break;
          }
        }
      }

      if (includeTask) {
        eligibleTaskIds.push(task.id);
      }
    }

    // 5. Check which user_tasks already exist (avoid duplicates)
    const { data: existingUserTasks } = await supabase
      .from("user_tasks")
      .select("task_id")
      .eq("user_id", user.id);

    const existingTaskIds = new Set(
      (existingUserTasks ?? []).map((ut: { task_id: string }) => ut.task_id)
    );

    const newTaskIds = eligibleTaskIds.filter((id) => !existingTaskIds.has(id));

    // 6. Insert user_tasks rows
    if (newTaskIds.length > 0) {
      const insertRows = newTaskIds.map((taskId) => ({
        user_id: user.id,
        task_id: taskId,
        status: "NOT_STARTED" as const,
      }));

      const { error: insertError } = await supabase
        .from("user_tasks")
        .insert(insertRows);

      if (insertError) {
        console.error("Error seeding user_tasks:", insertError);
        return NextResponse.json(
          { error: "Failed to seed tasks" },
          { status: 500 }
        );
      }
    }

    // 7. Generate user deadlines from profile dates
    await generateUserDeadlines(supabase, user.id, profile);

    return NextResponse.json({
      seeded: newTaskIds.length,
      total: eligibleTaskIds.length,
      existing: existingTaskIds.size,
    });
  } catch (err) {
    console.error("Roadmap generation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// Evaluate rule conditions against user context
// ============================================================
function evaluateConditions(
  conditionsJson: string | object,
  matchAll: boolean,
  ctx: { immigrationStatus: string; goals: string[] }
): boolean {
  let conditions: Array<{
    field: string;
    operator: string;
    value: string | string[];
  }>;

  try {
    conditions =
      typeof conditionsJson === "string"
        ? JSON.parse(conditionsJson)
        : conditionsJson;
  } catch {
    return true; // Invalid rule — default include
  }

  const results = conditions.map((cond) => {
    if (cond.field === "immigration_status") {
      if (cond.operator === "equals") return ctx.immigrationStatus === cond.value;
      if (cond.operator === "in")
        return (cond.value as string[]).includes(ctx.immigrationStatus);
      if (cond.operator === "not_equals")
        return ctx.immigrationStatus !== cond.value;
    }
    if (cond.field === "goals") {
      if (cond.operator === "contains")
        return ctx.goals.includes(cond.value as string);
      if (cond.operator === "not_contains")
        return !ctx.goals.includes(cond.value as string);
    }
    return true;
  });

  return matchAll ? results.every(Boolean) : results.some(Boolean);
}

// ============================================================
// Generate user-specific deadlines from profile dates
// ============================================================
async function generateUserDeadlines(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  profile: {
    study_permit_expiry?: string | null;
    graduation_date?: string | null;
    arrival_date?: string | null;
  }
) {
  const deadlinesToCreate: Array<{
    user_id: string;
    title: string;
    due_date: string;
    task_id: string | null;
    description: string;
  }> = [];

  // Study permit renewal reminder (6 months before expiry)
  if (profile.study_permit_expiry) {
    const expiry = new Date(profile.study_permit_expiry);
    const reminder = new Date(expiry);
    reminder.setMonth(reminder.getMonth() - 6);

    if (reminder > new Date()) {
      deadlinesToCreate.push({
        user_id: userId,
        title: "Study permit renewal — start process",
        due_date: reminder.toISOString().split("T")[0],
        task_id: null,
        description:
          "Apply for study permit renewal 3–6 months before it expires to avoid gaps in status.",
      });
    }
  }

  // PGWP application reminder (30 days after graduation)
  if (profile.graduation_date) {
    const grad = new Date(profile.graduation_date);
    const pgwpDeadline = new Date(grad);
    pgwpDeadline.setDate(pgwpDeadline.getDate() + 150); // 150 days = safe buffer before 180-day limit

    if (pgwpDeadline > new Date()) {
      deadlinesToCreate.push({
        user_id: userId,
        title: "Apply for PGWP (Post-Graduation Work Permit)",
        due_date: pgwpDeadline.toISOString().split("T")[0],
        task_id: null,
        description:
          "Must apply within 180 days of receiving official program completion notice.",
      });
    }
  }

  if (deadlinesToCreate.length > 0) {
    // Check for existing deadlines to avoid duplication
    const { data: existing } = await supabase
      .from("user_deadlines")
      .select("title")
      .eq("user_id", userId);

    const existingTitles = new Set(
      (existing ?? []).map((d: { title: string }) => d.title)
    );
    const newDeadlines = deadlinesToCreate.filter(
      (d) => !existingTitles.has(d.title)
    );

    if (newDeadlines.length > 0) {
      await supabase.from("user_deadlines").insert(newDeadlines);
    }
  }
}
