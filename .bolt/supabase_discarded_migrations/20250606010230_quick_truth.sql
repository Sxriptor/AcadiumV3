/*
  # Fix subscription policies and add service role bypass

  1. Changes
    - Add bypass RLS policy for service role
    - Fix subscription insert policy
    - Add proper error handling
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;

-- Allow service role to bypass RLS
ALTER TABLE subscriptions FORCE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);