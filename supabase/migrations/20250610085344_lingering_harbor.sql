/*
  # Add learning analytics and progress tracking

  1. New Tables
    - `learning_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `course_id` (uuid, references courses)
      - `lesson_id` (uuid, references course_lessons)
      - `session_start` (timestamp)
      - `session_end` (timestamp)
      - `duration_minutes` (integer)
      - `activities` (jsonb) - track specific activities during session
      - `created_at` (timestamp)
    
    - `user_skill_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `skill_category` (text) - 'coding', 'ai', 'business', etc.
      - `skill_name` (text)
      - `proficiency_level` (integer) - 1-10 scale
      - `assessment_date` (timestamp)
      - `evidence_type` (text) - 'course_completion', 'project', 'quiz', etc.
      - `evidence_id` (uuid) - reference to the evidence
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own data

  3. Performance
    - Add indexes for user_id, timestamps, and skill tracking
*/

-- Create learning_sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE SET NULL,
  session_start timestamptz NOT NULL,
  session_end timestamptz,
  duration_minutes integer DEFAULT 0,
  activities jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create user_skill_assessments table
CREATE TABLE IF NOT EXISTS user_skill_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill_category text NOT NULL,
  skill_name text NOT NULL,
  proficiency_level integer NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
  assessment_date timestamptz DEFAULT now(),
  evidence_type text NOT NULL,
  evidence_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skill_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_sessions
CREATE POLICY "Users can manage their own learning sessions"
  ON learning_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_skill_assessments
CREATE POLICY "Users can manage their own skill assessments"
  ON user_skill_assessments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_course_id ON learning_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_lesson_id ON learning_sessions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_start_time ON learning_sessions(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_user_skill_assessments_user_id ON user_skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skill_assessments_category ON user_skill_assessments(skill_category);
CREATE INDEX IF NOT EXISTS idx_user_skill_assessments_skill ON user_skill_assessments(skill_name);
CREATE INDEX IF NOT EXISTS idx_user_skill_assessments_date ON user_skill_assessments(assessment_date DESC);