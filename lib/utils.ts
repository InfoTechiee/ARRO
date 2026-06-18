import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TaskPriority } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  if (diffDays <= 365) return `In ${Math.ceil(diffDays / 30)} months`;
  return formatDate(dateStr);
}

export function getPriorityLabel(priority: TaskPriority): string {
  const labels: Record<TaskPriority, string> = {
    P1: "Critical",
    P2: "Important",
    P3: "Helpful",
    P4: "Optional",
  };
  return labels[priority] || priority;
}

export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    P1: "bg-red-50 text-red-700 border-red-100",
    P2: "bg-amber-50 text-amber-700 border-amber-100",
    P3: "bg-blue-50 text-blue-600 border-blue-100",
    P4: "bg-gray-50 text-gray-500 border-gray-100",
  };
  return colors[priority] || "bg-gray-50 text-gray-500 border-gray-100";
}

export function getEstimatedTimeLabel(minutes: number): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";
  return `${greeting}, ${name} 👋`;
}

export function truncate(str: string, maxLen: number): string {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + "…";
}

export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    IMM: "🛂",
    Immigration: "🛂",
    BANK: "🏦",
    Banking: "🏦",
    CRED: "💳",
    Credit: "💳",
    HOUSE: "🏠",
    Housing: "🏠",
    HEALTH: "🏥",
    Healthcare: "🏥",
    EDU: "📚",
    Education: "📚",
    CAREER: "💼",
    "Employment & Career": "💼",
    TAX: "📋",
    Taxes: "📋",
    FIN: "💰",
    "Financial Literacy": "💰",
    COMM: "🤝",
    Community: "🤝",
    GRAD: "🎓",
    Graduation: "🎓",
    FUTURE: "🌟",
    "Future Planning": "🌟",
    LEGAL: "⚖️",
    "Legal Rights": "⚖️",
    INS: "🛡️",
    Insurance: "🛡️",
    LIFE: "🌱",
    "Daily Life Setup": "🌱",
  };
  return map[category] || "📌";
}
