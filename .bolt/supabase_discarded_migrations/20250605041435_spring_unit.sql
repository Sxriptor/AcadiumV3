/*
  # Acadium - AI Platform Database Schema

  1. New Tables
    - courses
      - Stores course information and content
    - user_courses
      - Tracks user progress in courses
    - projects
      - Stores user-created AI projects
    - tools
      - Available AI tools and templates
    - user_tools
      - User's tool usage and customizations
    - achievements
      - User achievements and badges
    - community_posts
      - Community discussions and sharing
    - notifications
      - User notifications

  2. Security
    - RLS policies for all tables
    - User-specific access controls
    - Data privacy protections

  3. Indexes
    - Optimized for common queries
    - Full-text search capabilities
*/

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty text NOT NULL,
  content jsonb NOT NULL,
  prerequisites jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by authenticated users"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- User Courses Table
CREATE TABLE IF NOT EXISTS user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  course_id uuid REFERENCES courses NOT NULL,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own course progress"
  ON user_courses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress"
  ON user_courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
  ON user_courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  config jsonb,
  status text DEFAULT 'draft',
  public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON projects FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public projects are viewable by all users"
  ON projects FOR SELECT
  TO authenticated
  USING (public = true);

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  template jsonb,
  requirements jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by authenticated users"
  ON tools FOR SELECT
  TO authenticated
  USING (true);

-- User Tools Table
CREATE TABLE IF NOT EXISTS user_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  tool_id uuid REFERENCES tools NOT NULL,
  config jsonb,
  usage_count integer DEFAULT 0,
  last_used timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

ALTER TABLE user_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their tool configurations"
  ON user_tools FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb,
  achieved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[],
  likes integer DEFAULT 0,
  public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own posts"
  ON community_posts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public posts are viewable by all users"
  ON community_posts FOR SELECT
  TO authenticated
  USING (public = true);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_user_tools_user_id ON user_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tools_tool_id ON user_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Add full-text search capabilities
ALTER TABLE courses ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_courses_fts ON courses USING gin(fts);

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_community_posts_fts ON community_posts USING gin(fts);