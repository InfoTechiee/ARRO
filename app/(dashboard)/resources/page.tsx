import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Resource } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  "School Resources": "🏫",
  "Career & Employment": "💼",
  "Housing": "🏠",
  "Healthcare": "🏥",
  "Financial Support": "💰",
  "Immigration Support": "🛂",
  "Banking & Credit": "🏦",
  "Taxes": "📋",
  "Student Life": "🎓",
  "Safety & Emergency": "🚨",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; school?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: categories },
    { data: allResources },
    { data: schoolCollections },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*, school:schools(id, name, launch_phase)").eq("user_id", user.id).single(),
    supabase.from("resource_categories").select("*"),
    supabase.from("resources").select("*, category:resource_categories(name), tags:resource_tags(tag)").eq("verified", true).order("title"),
    supabase.from("school_resource_collections")
      .select("*, items:school_resource_collection_items(sort_order, resource:resources(id, title, description, source_url, source_name, category:resource_categories(name)))")
      .order("name"),
  ]);

  if (!profile) redirect("/onboarding");

  const school = profile.school as { id: string; name: string; launch_phase: number } | null;
  const resources = (allResources || []) as (Resource & { tags: { tag: string }[] })[];

  // Group resources by category
  const resourcesByCategory: Record<string, typeof resources> = {};
  for (const r of resources) {
    const catName = (r.category as { name: string } | null)?.name || "Other";
    if (!resourcesByCategory[catName]) resourcesByCategory[catName] = [];
    resourcesByCategory[catName].push(r);
  }

  // School-specific collection
  const mySchoolCollection = (schoolCollections || []).find(
    (c: { school_id: string }) => c.school_id === school?.id
  );

  const filterMode = params.filter;
  const showSchool = params.school === "true";

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-text-primary">Resources</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Trusted guides, tools, and services for your Ontario journey
        </p>
      </div>

      {/* School collection — shown first if from a launch school */}
      {mySchoolCollection && school && (
        <div className="mb-6">
          <div className="bg-emerald-600 text-white rounded-2xl p-5 mb-3">
            <h2 className="font-bold text-lg mb-0.5">🏫 {school.name}</h2>
            <p className="text-emerald-100 text-sm">{mySchoolCollection.description}</p>
          </div>
          <div className="space-y-2">
            {(mySchoolCollection.items || [])
              .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
              .slice(0, 6)
              .map((item: { resource: { id: string; title: string; source_url: string; source_name: string; category?: { name: string } } }) => (
              <a
                key={item.resource.id}
                href={item.resource.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white border border-border-light rounded-xl px-4 py-3 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {item.resource.title}
                  </p>
                  <p className="text-xs text-text-muted">{item.resource.source_name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Category grid */}
      <div className="mb-6">
        <h2 className="font-bold text-text-primary mb-3">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3">
          {(categories || []).map((cat: { id: string; name: string }) => {
            const count = resourcesByCategory[cat.name]?.length || 0;
            return (
              <Link
                key={cat.id}
                href={`/resources/${encodeURIComponent(cat.name)}`}
                className="bg-white border border-border-light rounded-2xl p-4 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors card-lift flex items-start gap-3"
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat.name] || "📁"}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary text-sm leading-snug">{cat.name}</p>
                  {count > 0 && (
                    <p className="text-xs text-text-muted mt-0.5">{count} resource{count !== 1 ? "s" : ""}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* All resources flat list */}
      <div>
        <h2 className="font-bold text-text-primary mb-3">All resources</h2>
        <div className="space-y-2">
          {resources.slice(0, 20).map((r) => (
            <a
              key={r.id}
              href={r.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-white border border-border-light rounded-xl px-4 py-3 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-base">{CATEGORY_ICONS[(r.category as { name: string } | null)?.name || ""] || "🔗"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {r.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{r.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-text-muted bg-slate-50 border border-border-light px-2 py-0.5 rounded-full">
                    {(r.category as { name: string } | null)?.name || "General"}
                  </span>
                  {r.verified && (
                    <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
