// ============================================================
// ARRO — Rules Engine (Section 17)
// ============================================================
// This module implements all roadmap logic. AI may NOT modify
// any of this logic — it explains tasks, it does not control them.

import type {
  UserProfile,
  Task,
  UserTask,
  TaskRule,
  TaskDependency,
  RuleCondition,
  UserGoal,
  ScoredTask,
  JourneyStage,
} from "@/types";

// ============================================================
// Section 17.3 — Stage Placement Logic
// ============================================================

export function getStageCodeFromOnboardingSelection(selection: string): string {
  // selection is already a STAGE-XX code from ARRIVAL_STAGE_OPTIONS
  return selection || "STAGE-01";
}

// ============================================================
// Section 17.5 — Recommendation Scoring Formula
// ============================================================

interface ScoringContext {
  userStageCode: string;
  userGoals: UserGoal[];
  userSchoolId: string | null;
  taskStageCode: string; // stage_code of this task's stage
  completedTaskIds: Set<string>; // task IDs completed by user
  justUnlockedTaskIds?: Set<string>; // HARD-unlocked by recent completion
  deadlineTaskIds?: Set<string>; // task IDs tied to deadline within 30 days
  taskSchoolId: string | null;
  taskPriority: string;
  taskCategory: string;
}

export function scoreTask(ctx: ScoringContext): number {
  let score = 0;

  // Priority points
  if (ctx.taskPriority === "P1") score += 40;
  else if (ctx.taskPriority === "P2") score += 25;
  else if (ctx.taskPriority === "P3") score += 10;
  // P4 = 0

  // Stage match or catch-up
  const stageOrder = getStageOrder(ctx.taskStageCode);
  const userStageOrder = getStageOrder(ctx.userStageCode);

  if (ctx.taskStageCode === ctx.userStageCode) {
    score += 30; // Current stage
  } else if (stageOrder < userStageOrder) {
    score += 50; // Catch-up boost — missed earlier steps surfaced first
  }
  // Future stage tasks get 0 bonus here

  // Goal match: +20 per matching goal (max +40)
  let goalBonus = 0;
  for (const goal of ctx.userGoals) {
    const goalCategories = GOAL_CATEGORY_MAP[goal] || [];
    if (goalCategories.includes(ctx.taskCategory)) {
      goalBonus += 20;
      if (goalBonus >= 40) break;
    }
  }
  score += goalBonus;

  // Recency boost for just-unlocked HARD dependencies
  if (ctx.justUnlockedTaskIds?.has(ctx.taskStageCode)) {
    score += 15;
  }

  // Deadline proximity boost
  if (ctx.deadlineTaskIds?.has(ctx.taskCategory)) {
    score += 35;
  }

  // School-specific match
  if (ctx.taskSchoolId && ctx.taskSchoolId === ctx.userSchoolId) {
    score += 10;
  }

  return score;
}

// Maps user goals to task categories that earn the goal bonus
const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  Jobs: ["CAREER", "Employment & Career"],
  Housing: ["HOUSE", "Housing", "LEGAL"],
  Healthcare: ["HEALTH", "Healthcare", "INS", "Insurance"],
  Banking: ["BANK", "Banking", "CRED", "Credit"],
  Credit: ["CRED", "Credit"],
  Taxes: ["TAX", "Taxes"],
  Immigration: ["IMM", "Immigration", "FUTURE", "Future Planning", "GRAD"],
  "Cost of Living": ["LIFE", "Daily Life Setup", "FIN", "Financial Literacy"],
};

// ============================================================
// Rule evaluation (Section 16.3 rule_json schema)
// ============================================================

interface ProfileForRules {
  arrival_stage_code?: string;
  immigration_status?: string;
  housing_status?: string;
  employment_status?: string;
  school_id?: string;
  goals?: UserGoal[];
  months_since_arrival?: number;
  months_to_graduation?: number;
}

function evaluateCondition(cond: RuleCondition, profile: ProfileForRules): boolean {
  let profileValue: string | string[] | number | undefined;

  switch (cond.field) {
    case "arrival_stage":
      profileValue = profile.arrival_stage_code;
      break;
    case "immigration_status":
      profileValue = profile.immigration_status;
      break;
    case "housing_status":
      profileValue = profile.housing_status;
      break;
    case "employment_status":
      profileValue = profile.employment_status;
      break;
    case "school":
      profileValue = profile.school_id;
      break;
    case "goals":
      profileValue = profile.goals || [];
      break;
    case "months_since_arrival":
      profileValue = profile.months_since_arrival;
      break;
    case "months_to_graduation":
      profileValue = profile.months_to_graduation;
      break;
    default:
      return true;
  }

  switch (cond.operator) {
    case "equals":
      return String(profileValue) === String(cond.value);
    case "not_equals":
      return String(profileValue) !== String(cond.value);
    case "contains":
      if (Array.isArray(profileValue)) {
        return profileValue.includes(cond.value as string);
      }
      return String(profileValue).includes(String(cond.value));
    case "greater_than":
      return Number(profileValue) > Number(cond.value);
    case "less_than":
      return Number(profileValue) < Number(cond.value);
    case "in":
      if (Array.isArray(cond.value)) {
        return cond.value.includes(String(profileValue));
      }
      return false;
    default:
      return true;
  }
}

export function evaluateTaskRule(rule: TaskRule | null, profile: ProfileForRules): boolean {
  if (!rule || !rule.rule_json?.conditions) return true; // No rule = show to all

  const { all, any } = rule.rule_json.conditions;

  if (all && all.length > 0) {
    if (!all.every((c) => evaluateCondition(c, profile))) return false;
  }
  if (any && any.length > 0) {
    if (!any.some((c) => evaluateCondition(c, profile))) return false;
  }

  return true;
}

// ============================================================
// Section 17.4 — Roadmap Generation Algorithm
// ============================================================

export function filterAndScoreTasks(
  tasks: Task[],
  userTasks: UserTask[],
  taskRules: TaskRule[],
  taskDependencies: TaskDependency[],
  stages: JourneyStage[],
  profile: UserProfile,
  userGoals: UserGoal[],
  currentStageCode: string
): ScoredTask[] {
  const stageCodeMap = new Map(stages.map((s) => [s.id, s.stage_code]));
  const taskRuleMap = new Map(taskRules.map((r) => [r.task_id, r]));
  const userTaskMap = new Map(userTasks.map((ut) => [ut.task_id, ut]));

  // Build dependency maps
  const hardPrereqMap = new Map<string, string[]>(); // task_id -> [prerequisite task_ids]
  const softPrereqMap = new Map<string, string[]>();

  for (const dep of taskDependencies) {
    if (dep.dependency_type === "HARD") {
      const existing = hardPrereqMap.get(dep.task_id) || [];
      hardPrereqMap.set(dep.task_id, [...existing, dep.prerequisite_task_id]);
    } else {
      const existing = softPrereqMap.get(dep.task_id) || [];
      softPrereqMap.set(dep.task_id, [...existing, dep.prerequisite_task_id]);
    }
  }

  const completedTaskIds = new Set(
    userTasks.filter((ut) => ut.status === "completed").map((ut) => ut.task_id)
  );

  const profileForRules: ProfileForRules = {
    arrival_stage_code: currentStageCode,
    immigration_status: profile.immigration_status || undefined,
    housing_status: profile.housing_status || undefined,
    employment_status: profile.employment_status || undefined,
    school_id: profile.school_id || undefined,
    goals: userGoals,
    months_since_arrival: profile.arrival_date
      ? Math.floor(
          (Date.now() - new Date(profile.arrival_date).getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        )
      : undefined,
  };

  const currentStageOrder = getStageOrder(currentStageCode);

  const result: ScoredTask[] = [];

  for (const task of tasks) {
    if (!task.active) continue;

    // Filter by stage (only show tasks at or before current stage)
    const taskStageCode = stageCodeMap.get(task.stage_id);
    if (!taskStageCode) continue;

    const taskStageOrder = getStageOrder(taskStageCode);

    // Special case: STAGE-06 (Employment Preparation) tasks surface via goal "Jobs"
    const isEmploymentPrepTask = taskStageCode === "STAGE-06";
    const userHasJobsGoal = userGoals.includes("Jobs");

    if (isEmploymentPrepTask && !userHasJobsGoal && taskStageOrder > currentStageOrder) {
      continue; // Only show STAGE-06 tasks if user has Jobs goal OR is at/past that stage
    }

    if (!isEmploymentPrepTask && taskStageOrder > currentStageOrder) {
      continue; // Future tasks hidden
    }

    // School filter
    if (task.school_id && task.school_id !== profile.school_id) continue;

    // OSAP rule — FIN-016 only for PR/Protected Person
    if (task.task_code === "FIN-016") {
      const status = profile.immigration_status;
      if (status !== "Permanent Resident" && status !== "Protected Person") continue;
    }

    // Evaluate task rules
    const rule = taskRuleMap.get(task.id) || null;
    if (!evaluateTaskRule(rule, profileForRules)) continue;

    // Get existing user_task or create a virtual one
    const existingUserTask = userTaskMap.get(task.id);
    const status: "not_started" | "completed" | "not_applicable" =
      existingUserTask?.status || "not_started";

    // Check HARD dependencies — hide task if any hard prereq not completed
    const hardPrereqs = hardPrereqMap.get(task.id) || [];
    const allHardCompleted = hardPrereqs.every((prereqId) =>
      completedTaskIds.has(prereqId)
    );
    if (!allHardCompleted && status !== "completed") continue;

    // Check SOFT dependencies — flag but still show
    const softPrereqs = softPrereqMap.get(task.id) || [];
    const uncompletedSoftPrereq = softPrereqs.find(
      (prereqId) => !completedTaskIds.has(prereqId)
    );

    // Find the soft prereq task title if needed
    let softPrereqTitle: string | undefined;
    if (uncompletedSoftPrereq) {
      const prereqTask = tasks.find((t) => t.id === uncompletedSoftPrereq);
      if (prereqTask) softPrereqTitle = prereqTask.title;
    }

    const scored: ScoredTask = {
      id: existingUserTask?.id || `virtual-${task.id}`,
      user_id: profile.user_id,
      task_id: task.id,
      status,
      completed_at: existingUserTask?.completed_at || null,
      created_at: existingUserTask?.created_at || new Date().toISOString(),
      task,
      score: scoreTask({
        userStageCode: currentStageCode,
        userGoals,
        userSchoolId: profile.school_id,
        taskStageCode: taskStageCode,
        completedTaskIds,
        taskSchoolId: task.school_id,
        taskPriority: task.priority,
        taskCategory: task.category,
      }),
      softPrereqTitle,
    };

    result.push(scored);
  }

  // Sort: not_started first (by score desc), then completed, then not_applicable
  return result.sort((a, b) => {
    if (a.status === "not_started" && b.status !== "not_started") return -1;
    if (a.status !== "not_started" && b.status === "not_started") return 1;
    return b.score - a.score;
  });
}

// ============================================================
// Section 17.8 — Missing Opportunities Engine (static fallback)
// ============================================================

// Per-stage fallback tasks (task_codes) if peer group < 10
export const MISSING_OPPS_FALLBACK: Record<string, string[]> = {
  "STAGE-01": ["BANK-001", "HOUSE-004", "IMM-005"],
  "STAGE-02": ["LEGAL-011", "INS-001", "LIFE-006"],
  "STAGE-03": ["TAX-001", "CRED-001", "CAREER-001"],
  "STAGE-04": ["FIN-001", "INS-009", "LEGAL-003"],
  "STAGE-05": ["TAX-008", "TAX-009", "CRED-007"],
  "STAGE-06": ["CAREER-017", "CAREER-020", "CAREER-023"],
  "STAGE-07": ["IMM-011", "GRAD-010", "INS-014"],
  "STAGE-08": ["FUTURE-001", "FIN-010", "FUTURE-008"],
};

export function getMissingOpportunities(
  scoredTasks: ScoredTask[],
  currentStageCode: string,
  limit = 3
): ScoredTask[] {
  const fallbackCodes = MISSING_OPPS_FALLBACK[currentStageCode] || [];

  const missing = scoredTasks.filter((st) => {
    if (st.status !== "not_started") return false;
    return fallbackCodes.includes(st.task?.task_code || "");
  });

  return missing.slice(0, limit);
}

// ============================================================
// Helpers
// ============================================================

export function getStageOrder(stageCode: string): number {
  const num = parseInt(stageCode.replace("STAGE-", ""), 10);
  return isNaN(num) ? 0 : num;
}

export function computeProgressPercent(userTasks: UserTask[]): number {
  if (!userTasks.length) return 0;
  const relevant = userTasks.filter((ut) => ut.status !== "not_applicable");
  if (!relevant.length) return 0;
  const completed = relevant.filter((ut) => ut.status === "completed").length;
  return Math.round((completed / relevant.length) * 100);
}

// ============================================================
// Section 16.9 — Free Guide scoring (stateless, pre-signup)
// ============================================================

export function scoreFreeGuideTasks(
  tasks: Task[],
  stageCode: string,
  immigrationStatus: string,
  concerns: string[],
  stages: JourneyStage[]
): Task[] {
  const stageCodeMap = new Map(stages.map((s) => [s.stage_code, s.id]));
  const targetStageId = stageCodeMap.get(stageCode);

  return tasks
    .filter((t) => t.stage_id === targetStageId && t.active && !t.school_id)
    .map((t) => {
      let score = 0;
      if (t.priority === "P1") score += 10;
      else if (t.priority === "P2") score += 5;
      else score += 2;

      for (const concern of concerns) {
        const cats = GOAL_CATEGORY_MAP[concern] || [];
        if (cats.includes(t.category)) score += 15;
      }

      return { task: t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.task);
}
