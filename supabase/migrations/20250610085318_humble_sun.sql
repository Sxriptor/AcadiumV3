/*
  # Add course lessons and detailed progress tracking

  1. New Tables
    - `course_lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `content` (jsonb) - lesson content, videos, exercises
      - `order_index` (integer) - lesson order within course
      - `duration_minutes` (integer)
      - `is_free` (boolean) - whether lesson is free or requires subscription
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `lesson_id` (uuid, references course_lessons)
      - `completed` (boolean)
      - `completion_percentage` (integer) - 0-100
      - `time_spent_minutes` (integer)
      - `last_position` (jsonb) - bookmark position in lesson
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read lessons
    - Add policies for users to manage their own progress

  3. Performance
    - Add indexes for course_id, user_id, and completion tracking
*/

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content jsonb NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent_minutes integer DEFAULT 0,
  last_position jsonb DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_lessons
CREATE POLICY "Course lessons are viewable by authenticated users"
  ON course_lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_lesson_progress
CREATE POLICY "Users can view their own lesson progress"
  ON user_lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
  ON user_lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON user_lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON course_lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed ON user_lesson_progress(completed);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_lessons_updated_at 
    BEFORE UPDATE ON course_lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at 
    BEFORE UPDATE ON user_lesson_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();