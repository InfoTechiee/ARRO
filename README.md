# Arro — Ontario International Student Settlement Platform

Arro is a personalized digital platform that guides international students through every stage of settling in Ontario, Canada. It surfaces the right tasks at the right time based on each student's arrival stage, school, immigration status, and goals.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database + Auth**: Supabase (Postgres + Row Level Security)
- **AI**: Anthropic Claude API (`claude-sonnet-4-6`)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd arro
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your project URL and anon key

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ANTHROPIC_API_KEY=sk-ant-...
```

Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

### 4. Run database migrations

In your Supabase project's **SQL Editor**, run these files **in order**:

```
1. supabase/schema.sql   — Creates all tables and RLS policies
2. supabase/seed.sql     — Seeds stages, tasks, schools, and resources
```

> **Note**: Run schema.sql first, then seed.sql. The seed depends on tables created by the schema.

### 5. Configure Supabase Auth

In your Supabase dashboard:
- Go to **Authentication → URL Configuration**
- Set **Site URL** to `http://localhost:3000` (dev) or your Vercel URL (prod)
- Add `http://localhost:3000/**` to **Redirect URLs**

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
arro/
├── app/
│   ├── (auth)/              # Login, signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Authenticated app pages
│   │   ├── dashboard/       # Home feed
│   │   ├── journey/         # Stage map + task detail + deadlines
│   │   ├── resources/       # Resource library + category pages
│   │   ├── ai/              # AI Guide chat
│   │   ├── profile/         # User profile editor
│   │   └── settings/        # Account settings
│   ├── api/
│   │   ├── ai/              # POST /api/ai — Claude chat endpoint
│   │   └── roadmap/
│   │       └── generate/    # POST /api/roadmap/generate — seeds user_tasks
│   ├── onboarding/          # 7-step onboarding flow
│   └── page.tsx             # Landing page
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx    # Mobile bottom nav + desktop sidebar
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── ProgressRing.tsx
├── lib/
│   ├── rules-engine.ts      # Task scoring + filtering logic
│   ├── utils.ts             # Shared utilities
│   └── supabase/
│       ├── client.ts        # Browser Supabase client
│       └── server.ts        # Server Supabase client
├── types/
│   └── index.ts             # All TypeScript types
└── supabase/
    ├── schema.sql            # Database schema + RLS policies
    └── seed.sql              # Task library, schools, resources
```

---

## Phase 1 Schools

Full personalization (school-specific tasks + resources):
- York University
- Seneca Polytechnic
- George Brown College

Phase 2 schools (7 more) have profiles in the database and will receive custom content in future releases.

---

## Key Features

### Rules Engine (`lib/rules-engine.ts`)
Every task has an eligibility score computed from:
- Stage match (current vs target stage)
- Immigration status (e.g. OSAP only for PR/Protected Person)
- Goals (Jobs goal unlocks Employment Prep tasks)
- School match
- Priority weight (P1–P4)
- Deadline proximity

### Roadmap Generation (`app/api/roadmap/generate/`)
Called after onboarding. Evaluates all tasks against the user's profile and seeds `user_tasks` rows for eligible tasks. Also generates `user_deadlines` from permit expiry and graduation dates.

### AI Guide (`app/api/ai/`)
Powered by `claude-sonnet-4-6`. The system prompt includes:
- User's profile context (stage, school, goals, status)
- Verified resource URLs from the database
- Strict constraints: no immigration legal advice, always recommend official sources, Ontario-specific only

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# ANTHROPIC_API_KEY
```

After deploying, update your Supabase Auth redirect URLs to include your Vercel domain.

---

## Database Schema Summary

| Table | Purpose |
|-------|---------|
| `users` | Supabase auth users |
| `schools` | 10 Ontario schools (3 Phase 1) |
| `journey_stages` | 8 settlement stages |
| `user_profiles` | Per-user profile data |
| `user_goals` | User's selected goals |
| `tasks` | 88 tasks (general + school-specific) |
| `user_tasks` | User's task completion state |
| `task_rules` | Eligibility rules per task |
| `task_dependencies` | Task prerequisite chains |
| `resources` | 31 curated external resources |
| `resource_categories` | 8 resource categories |
| `school_resource_collections` | School-specific resource bundles |
| `user_deadlines` | Generated key date reminders |
| `ai_conversations` | AI Guide conversation history |
| `ai_messages` | Individual chat messages |
| `deadline_templates` | Rules for auto-generating deadlines |

---

## Development Notes

- The `.env` file contains placeholder values so `next build` works in CI without real credentials. Real credentials always go in `.env.local` (gitignored).
- The `middleware.ts` file handles session refresh. Note: Next.js 16 has deprecated the `middleware` filename in favour of `proxy` — this is a warning only and does not affect functionality.
- All Supabase server calls use `await createClient()` from `lib/supabase/server.ts` (cookies-based session).
