-- ============================================================
-- Arro Database Schema v2.0
-- Run this in Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE USER TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT,
  website TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  launch_phase INTEGER DEFAULT 2
);

CREATE TABLE IF NOT EXISTS journey_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT,
  school_id UUID REFERENCES schools(id),
  program_name TEXT,
  immigration_status TEXT,
  arrival_stage_id UUID REFERENCES journey_stages(id),
  current_stage_id UUID REFERENCES journey_stages(id),
  arrival_date DATE,
  housing_status TEXT,
  employment_status TEXT,
  graduation_date DATE,
  study_permit_expiry DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL
);

-- ============================================================
-- JOURNEY ENGINE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  why_it_matters TEXT,
  category TEXT NOT NULL,
  stage_id UUID REFERENCES journey_stages(id),
  priority TEXT CHECK (priority IN ('P1','P2','P3','P4')) DEFAULT 'P3',
  estimated_minutes INTEGER DEFAULT 30,
  school_id UUID REFERENCES schools(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id),
  status TEXT CHECK (status IN ('not_started','completed','not_applicable')) DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

CREATE TABLE IF NOT EXISTS task_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  rule_json JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  prerequisite_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type TEXT CHECK (dependency_type IN ('HARD','SOFT')) DEFAULT 'SOFT',
  UNIQUE(task_id, prerequisite_task_id)
);

-- ============================================================
-- DEADLINE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Immigration','School','Tax','Insurance')),
  date DATE,
  recurrence TEXT CHECK (recurrence IN ('annual','once','per_user')),
  applies_to_rule JSONB
);

CREATE TABLE IF NOT EXISTS user_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  deadline_id UUID REFERENCES deadlines(id),
  due_date DATE,
  status TEXT CHECK (status IN ('upcoming','completed','dismissed')) DEFAULT 'upcoming'
);

-- ============================================================
-- RESOURCE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS resource_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES resource_categories(id),
  source_url TEXT,
  source_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  school_id UUID REFERENCES schools(id),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS resource_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS school_resource_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS school_resource_collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES school_resource_collections(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id),
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- AI TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own profiles" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own tasks" ON user_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own deadlines" ON user_deadlines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own conversations" ON ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own messages" ON ai_messages FOR ALL USING (
  auth.uid() = (SELECT user_id FROM ai_conversations WHERE id = conversation_id)
);

-- Public read on reference tables
CREATE POLICY "Public schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Public stages" ON journey_stages FOR SELECT USING (true);
CREATE POLICY "Public tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public task_rules" ON task_rules FOR SELECT USING (true);
CREATE POLICY "Public task_deps" ON task_dependencies FOR SELECT USING (true);
CREATE POLICY "Public deadlines" ON deadlines FOR SELECT USING (true);
CREATE POLICY "Public resource_cats" ON resource_categories FOR SELECT USING (true);
CREATE POLICY "Public resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Public resource_tags" ON resource_tags FOR SELECT USING (true);
CREATE POLICY "Public collections" ON school_resource_collections FOR SELECT USING (true);
CREATE POLICY "Public collection_items" ON school_resource_collection_items FOR SELECT USING (true);

-- ============================================================
-- DEADLINE TEMPLATES (reference table for generating user deadlines)
-- ============================================================
CREATE TABLE IF NOT EXISTS deadline_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_code TEXT NOT NULL,
  deadline_type TEXT NOT NULL, -- STUDY_PERMIT_EXPIRY, ARRIVAL_DATE, GRADUATION_DATE, SEMESTER_START
  days_before_trigger INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deadline_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public deadline_templates" ON deadline_templates FOR SELECT USING (true);
