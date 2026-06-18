import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function ResourceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryId = decodeURIComponent(category);

  const supabase = await createClient();

  const { data: categoryData } = await supabase
    .from("resource_categories")
    .select("*")
    .eq("id", categoryId)
    .single();

  if (!categoryData) notFound();

  // Get user's school for filtering school-specific resources
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userSchoolId: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("school_id")
      .eq("user_id", user.id)
      .single();
    userSchoolId = profile?.school_id ?? null;
  }

  // Get resources for this category (universal + user's school)
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("category_id", categoryId)
    .or(`school_id.is.null${userSchoolId ? `,school_id.eq.${userSchoolId}` : ""}`)
    .order("is_free", { ascending: false });

  return (
    <div className="max-w-lg mx-auto md:max-w-2xl px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary font-medium mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Resources
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{categoryData.icon}</span>
          <h1 className="text-2xl font-extrabold text-text-primary">
            {categoryData.name}
          </h1>
        </div>
        <p className="text-sm text-text-secondary mt-1 ml-[52px]">
          {resources?.length ?? 0} resource
          {(resources?.length ?? 0) !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Resource list */}
      <div className="space-y-3">
        {(resources ?? []).map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl border border-border-light p-4 hover:border-emerald-200 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-text-primary text-sm group-hover:text-emerald-700 transition-colors">
                    {resource.title}
                  </h3>
                  {resource.is_free && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                      Free
                    </span>
                  )}
                  {resource.school_id && (
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                      Your school
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {resource.description}
                </p>
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {resource.tags.slice(0, 4).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs text-text-muted bg-slate-50 border border-border-light px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <svg
                className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5 group-hover:text-emerald-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-medium truncate">
              {new URL(resource.url).hostname.replace("www.", "")}
            </div>
          </a>
        ))}

        {(!resources || resources.length === 0) && (
          <div className="text-center py-12 text-text-muted">
            <div className="text-4xl mb-3">{categoryData.icon}</div>
            <p className="font-medium text-text-secondary">
              No resources yet in this category
            </p>
            <p className="text-sm mt-1">Check back — we&apos;re adding more regularly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
