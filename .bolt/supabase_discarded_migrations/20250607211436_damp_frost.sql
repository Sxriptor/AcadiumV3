/*
  # Add user favorites and recent pages functionality

  1. New Tables
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `page_path` (text, the route path)
      - `page_title` (text, display name)
      - `page_icon` (text, icon name)
      - `created_at` (timestamp)
    - `user_recent_pages`
      - `id` (uuid, primary key) 
      - `user_id` (uuid, foreign key to users)
      - `page_path` (text, the route path)
      - `page_title` (text, display name)
      - `page_icon` (text, icon name)
      - `last_visited` (timestamp)
      - `visit_count` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own data
*/

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  page_title text NOT NULL,
  page_icon text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, page_path)
);

-- Create user_recent_pages table
CREATE TABLE IF NOT EXISTS user_recent_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  page_title text NOT NULL,
  page_icon text NOT NULL,
  last_visited timestamptz DEFAULT now(),
  visit_count integer DEFAULT 1,
  UNIQUE(user_id, page_path)
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recent_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_favorites
CREATE POLICY "Users can manage their own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_recent_pages
CREATE POLICY "Users can manage their own recent pages"
  ON user_recent_pages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_recent_pages_user_id ON user_recent_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recent_pages_last_visited ON user_recent_pages(last_visited DESC);