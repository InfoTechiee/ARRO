"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function SettingsPage() {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleDeleteAccount() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    // In a real app, call a server action to delete the user record
    // For prototype: sign out and redirect
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6 space-y-6">
      <div>
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary font-medium mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>
        <h1 className="text-2xl font-extrabold text-text-primary">Settings</h1>
      </div>

      {/* Account Settings */}
      <Card>
        <h2 className="font-bold text-text-primary mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Email notifications</span>
            <span className="text-text-muted text-xs">Coming soon</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Push notifications</span>
            <span className="text-text-muted text-xs">Coming soon</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Change password</span>
            <button className="text-emerald-600 text-xs font-semibold">Request link</button>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <h2 className="font-bold text-text-primary mb-2">Privacy & data</h2>
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          Arro collects only the information you provide during onboarding and while using the app. Your data is never sold and is used exclusively to personalize your experience.
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 py-2 border-b border-border-light">
            <div className="flex-1">
              <p className="font-medium text-text-primary">Document handling</p>
              <p className="text-xs text-text-muted mt-0.5">
                Document upload and analysis is available in Phase 2. When launched, you&apos;ll choose whether to analyze-and-delete or save documents to your account.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full flex-shrink-0">Phase 2</span>
          </div>
          <div className="py-2">
            <p className="font-medium text-text-primary mb-0.5">Data export</p>
            <p className="text-xs text-text-muted mb-2">Download all your Arro data</p>
            <button className="text-xs text-emerald-600 font-semibold hover:text-emerald-700">
              Request data export
            </button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h2 className="font-bold text-text-primary mb-3">About Arro</h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-text-muted">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Content updated</span>
            <span className="text-text-muted">2024</span>
          </div>
          <div className="flex justify-between">
            <span>Supported schools</span>
            <span className="text-text-muted">York, Seneca, GBC + 7 more</span>
          </div>
        </div>
        <div className="mt-4 flex gap-3 text-xs">
          <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">Privacy Policy</Link>
          <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">Terms of Service</Link>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-100">
        <h2 className="font-bold text-danger mb-2">Danger zone</h2>
        <p className="text-sm text-text-secondary mb-4">
          Deleting your account permanently removes all your data including progress, tasks, and conversation history. This cannot be undone.
        </p>
        {confirmDelete && (
          <p className="text-sm text-danger font-medium mb-3">
            ⚠️ Are you sure? This will permanently delete your account and all data.
          </p>
        )}
        <Button
          onClick={handleDeleteAccount}
          loading={deleting}
          variant="danger"
          size="sm"
        >
          {confirmDelete ? "Yes, delete my account" : "Delete account"}
        </Button>
        {confirmDelete && (
          <button
            onClick={() => setConfirmDelete(false)}
            className="ml-3 text-sm text-text-muted hover:text-text-secondary"
          >
            Cancel
          </button>
        )}
      </Card>
    </div>
  );
}
