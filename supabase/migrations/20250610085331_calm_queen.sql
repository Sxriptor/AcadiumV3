/*
  # Add project collaboration and sharing features

  1. New Tables
    - `project_collaborators`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references users)
      - `role` (text) - 'owner', 'editor', 'viewer'
      - `invited_by` (uuid, references users)
      - `invited_at` (timestamp)
      - `accepted_at` (timestamp)
      - `status` (text) - 'pending', 'accepted', 'declined'
    
    - `project_comments`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `parent_id` (uuid, references project_comments) - for replies
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for project access control
    - Add policies for comment management

  3. Performance
    - Add indexes for project_id, user_id, and timestamps
*/

-- Create project_collaborators table
CREATE TABLE IF NOT EXISTS project_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  invited_by uuid,
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  UNIQUE(project_id, user_id)
);

-- Create project_comments table
CREATE TABLE IF NOT EXISTS project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES project_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_collaborators
CREATE POLICY "Users can view collaborators of projects they have access to"
  ON project_collaborators
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND (p.user_id = auth.uid() OR p.public = true)
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Project owners can manage collaborators"
  ON project_collaborators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for project_comments
CREATE POLICY "Users can view comments on accessible projects"
  ON project_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND (p.user_id = auth.uid() OR p.public = true)
    )
  );

CREATE POLICY "Users can create comments on accessible projects"
  ON project_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_id 
      AND (p.user_id = auth.uid() OR p.public = true)
    )
  );

CREATE POLICY "Users can update their own comments"
  ON project_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON project_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_status ON project_collaborators(status);
CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent_id ON project_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_created_at ON project_comments(created_at DESC);

-- Add trigger to update updated_at timestamp for comments
CREATE TRIGGER update_project_comments_updated_at 
    BEFORE UPDATE ON project_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();