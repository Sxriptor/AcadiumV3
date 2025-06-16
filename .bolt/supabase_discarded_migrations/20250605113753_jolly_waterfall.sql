/*
  # Fix subscriptions RLS policies

  1. Changes
    - Add RLS policies for subscriptions table
    - Allow users to insert their own subscriptions
    - Allow users to view their own subscriptions
*/

-- Allow users to insert their own subscriptions
CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);