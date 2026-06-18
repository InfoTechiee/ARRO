// ============================================================
// ARRO — Core TypeScript Types
// ============================================================

export type ImmigrationStatus =
  | "International Student / Study Permit"
  | "Permanent Resident"
  | "Protected Person"
  | "Canadian Citizen";

export type HousingStatus =
  | "On-campus residence"
  | "Off-campus rental"
  | "Homestay"
  | "Temporary / Hotel"
  | "Living with family/friends"
  | "Not arranged yet";

export type EmploymentStatus =
  | "Not working"
  | "Looking for work"
  | "Working part-time"
  | "Working full-time"
  | "Self-employed";

export type UserGoal =
  | "Housing"
  | "Jobs"
  | "Healthcare"
  | "Banking"
  | "Credit"
  | "Taxes"
  | "Immigration"
  | "Cost of Living";

export type TaskPriority = "P1" | "P2" | "P3" | "P4";
export type TaskStatus = "not_started" | "completed" | "not_applicable";
export type DependencyType = "HARD" | "SOFT";
export type DeadlineStatus = "upcoming" | "completed" | "dismissed";
export type DeadlineCategory = "Immigration" | "School" | "Tax" | "Insurance";
export type MessageRole = "user" | "assistant";

// ============================================================
// Database Table Types
// ============================================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  school_id: string | null;
  program_name: string | null;
  immigration_status: ImmigrationStatus | null;
  arrival_stage_id: string | null;
  arrival_date: string | null;
  housing_status: HousingStatus | null;
  employment_status: EmploymentStatus | null;
  graduation_date: string | null;
  study_permit_expiry: string | null;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  city: string;
  website: string;
  logo_url: string | null;
  active: boolean;
  launch_phase: number;
}

export interface JourneyStage {
  id: string;
  stage_code: string; // STAGE-01..08
  name: string;
  description: string;
  sort_order: number;
}

export interface Task {
  id: string;
  task_code: string; // e.g. BANK-001
  title: string;
  description: string;
  why_it_matters: string;
  category: string;
  stage_id: string;
  priority: TaskPriority;
  estimated_minutes: number;
  school_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
  // Joined fields
  task?: Task;
  stage?: JourneyStage;
}

export interface TaskRule {
  id: string;
  task_id: string;
  rule_json: RuleJson;
}

export interface RuleCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in";
  value: string | string[] | number;
}

export interface RuleJson {
  conditions: {
    all?: RuleCondition[];
    any?: RuleCondition[];
  };
}

export interface TaskDependency {
  id: string;
  task_id: string;
  prerequisite_task_id: string;
  dependency_type: DependencyType;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  category: DeadlineCategory;
  date: string;
  recurrence: "annual" | "once" | "per_user";
  applies_to_rule: RuleJson | null;
}

export interface UserDeadline {
  id: string;
  user_id: string;
  deadline_id: string;
  due_date: string;
  status: DeadlineStatus;
  deadline?: Deadline;
}

export interface ResourceCategory {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category_id: string;
  source_url: string;
  source_name: string;
  verified: boolean;
  school_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  category?: ResourceCategory;
  tags?: string[];
}

export interface SchoolResourceCollection {
  id: string;
  school_id: string;
  name: string;
  description: string;
  items?: Resource[];
}

export interface AIConversation {
  id: string;
  user_id: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface UserGoalRecord {
  id: string;
  user_id: string;
  goal: UserGoal;
}

// ============================================================
// Application-Level Types
// ============================================================

export interface OnboardingData {
  firstName: string;
  schoolId: string;
  programName: string;
  arrivalStageCode: string;
  arrivalDate: string;
  housingStatus: HousingStatus | "";
  employmentStatus: EmploymentStatus | "";
  goals: UserGoal[];
  immigrationStatus: ImmigrationStatus | "";
}

export interface ScoredTask extends UserTask {
  score: number;
  softPrereqTitle?: string; // If there's a soft prerequisite not yet completed
}

export interface DashboardData {
  profile: UserProfile;
  school: School | null;
  currentStage: JourneyStage | null;
  progressPercent: number;
  recommendedTasks: ScoredTask[];
  upcomingDeadlines: UserDeadline[];
  missingOpportunities: UserTask[];
  totalTasks: number;
  completedTasks: number;
}

export interface JourneyData {
  stages: JourneyStage[];
  tasksByStage: Record<string, UserTask[]>;
  currentStageCode: string;
  profile: UserProfile;
}

export interface ArrivalStageOption {
  value: string; // STAGE-01..08
  label: string; // Plain-language label
  description: string;
}

// Stage options for onboarding (7 selectable options — STAGE-06 excluded from direct selection)
export const ARRIVAL_STAGE_OPTIONS: ArrivalStageOption[] = [
  {
    value: "STAGE-01",
    label: "I haven't moved to Canada yet",
    description: "You're preparing for arrival",
  },
  {
    value: "STAGE-02",
    label: "I just arrived — within the last 30 days",
    description: "First week in Ontario",
  },
  {
    value: "STAGE-03",
    label: "I arrived 1–2 months ago",
    description: "Building your foundation",
  },
  {
    value: "STAGE-04",
    label: "I arrived 3–12 months ago and I'm getting settled",
    description: "Establishing stability",
  },
  {
    value: "STAGE-05",
    label: "I've been here over a year and I'm focused on school",
    description: "Academic and community integration",
  },
  {
    value: "STAGE-07",
    label: "I'm graduating within the next 12 months",
    description: "Preparing your transition",
  },
  {
    value: "STAGE-08",
    label: "I've already graduated and I'm planning my future in Canada",
    description: "Long-term settlement planning",
  },
];

export const GOAL_OPTIONS: UserGoal[] = [
  "Housing",
  "Jobs",
  "Healthcare",
  "Banking",
  "Credit",
  "Taxes",
  "Immigration",
  "Cost of Living",
];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  P1: "Critical",
  P2: "Important",
  P3: "Helpful",
  P4: "Optional",
};

export const STAGE_NAMES: Record<string, string> = {
  "STAGE-01": "Planning Arrival",
  "STAGE-02": "First Week",
  "STAGE-03": "First Month",
  "STAGE-04": "Settling In",
  "STAGE-05": "Thriving In School",
  "STAGE-06": "Employment Prep",
  "STAGE-07": "Graduation Planning",
  "STAGE-08": "Future Planning",
};
