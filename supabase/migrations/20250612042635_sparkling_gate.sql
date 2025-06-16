/*
  # User Progress Tracking System

  1. New Tables
    - `user_learning_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tool_id` (text) - e.g., 'n8n', 'webhooks', 'supabase', etc.
      - `step_id` (text) - unique identifier for the step
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `notes` (text) - optional user notes
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_checklist_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tool_id` (text) - e.g., 'n8n', 'webhooks', 'supabase', etc.
      - `checklist_item_id` (text) - unique identifier for the checklist item
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own progress data

  3. Performance
    - Add indexes for user_id and tool_id for efficient queries
*/

-- Create user_learning_progress table
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_id text NOT NULL,
  step_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_id, step_id)
);

-- Create user_checklist_items table
CREATE TABLE IF NOT EXISTS user_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_id text NOT NULL,
  checklist_item_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_id, checklist_item_id)
);

-- Enable RLS
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_learning_progress
CREATE POLICY "Users can manage their own learning progress"
  ON user_learning_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_checklist_items
CREATE POLICY "Users can manage their own checklist items"
  ON user_checklist_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_tool_id ON user_learning_progress(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_completed ON user_learning_progress(completed);
CREATE INDEX IF NOT EXISTS idx_user_checklist_items_user_id ON user_checklist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_items_tool_id ON user_checklist_items(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_items_completed ON user_checklist_items(completed);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_learning_progress_updated_at 
    BEFORE UPDATE ON user_learning_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_checklist_items_updated_at 
    BEFORE UPDATE ON user_checklist_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();