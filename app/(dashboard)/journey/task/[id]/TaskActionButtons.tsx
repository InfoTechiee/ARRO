"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function TaskActionButtons({
  taskId,
  currentStatus,
  userId,
}: {
  taskId: string;
  currentStatus: TaskStatus;
  userId: string;
}) {
  const [status, setStatus] = useState<TaskStatus>(currentStatus);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function updateStatus(newStatus: TaskStatus) {
    setLoading(newStatus);
    try {
      // Check if user_task exists
      const { data: existing } = await supabase
        .from("user_tasks")
        .select("id")
        .eq("user_id", userId)
        .eq("task_id", taskId)
        .single();

      if (existing) {
        await supabase
          .from("user_tasks")
          .update({
            status: newStatus,
            completed_at: newStatus === "completed" ? new Date().toISOString() : null,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_tasks").insert({
          user_id: userId,
          task_id: taskId,
          status: newStatus,
          completed_at: newStatus === "completed" ? new Date().toISOString() : null,
        });
      }

      setStatus(newStatus);
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (status === "completed") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-emerald-700">Completed!</p>
          <p className="text-xs text-emerald-600">Great work — this unlocks your next tasks.</p>
        </div>
        <button
          onClick={() => updateStatus("not_started")}
          disabled={loading !== null}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
        >
          Undo
        </button>
      </div>
    );
  }

  if (status === "not_applicable") {
    return (
      <div className="bg-slate-50 border border-border-light rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <span className="text-slate-500 text-lg">—</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-text-secondary">Not applicable</p>
          <p className="text-xs text-text-muted">This task doesn&apos;t apply to your situation.</p>
        </div>
        <button
          onClick={() => updateStatus("not_started")}
          disabled={loading !== null}
          className="text-xs text-text-secondary hover:text-text-primary font-medium underline"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-5">
      <Button
        onClick={() => updateStatus("completed")}
        loading={loading === "completed"}
        className="flex-1"
        size="lg"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Mark Complete
      </Button>
      <Button
        onClick={() => updateStatus("not_applicable")}
        loading={loading === "not_applicable"}
        variant="ghost"
        className={cn(
          "flex-shrink-0 px-4 border border-border-light rounded-2xl h-11 text-sm font-medium",
          "hover:bg-slate-50 text-text-muted hover:text-text-secondary"
        )}
      >
        Not applicable
      </Button>
    </div>
  );
}
