export const dynamic = "force-dynamic";

import BottomNav from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name")
    .eq("user_id", user.id)
    .single();

  if (!profile?.first_name) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Desktop sidebar space */}
      <div className="md:ml-64">
        {/* Main content */}
        <main className="min-h-screen pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
