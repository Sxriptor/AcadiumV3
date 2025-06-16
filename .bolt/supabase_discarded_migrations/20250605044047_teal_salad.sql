/*
  # Subscription System Tables

  1. New Tables
    - `subscriptions`
      - Stores user subscription information
      - Links to Stripe customer and subscription IDs
    - `plans`
      - Available subscription plans
      - Price and feature information

  2. Security
    - RLS policies for subscription data
    - User-specific access controls
*/

-- Plans Table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  interval text NOT NULL,
  stripe_price_id text UNIQUE,
  features jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by all users"
  ON plans FOR SELECT
  TO authenticated
  USING (true);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan_id uuid REFERENCES plans NOT NULL,
  status text NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(active);

-- Insert default plan
INSERT INTO plans (name, description, price, interval, features)
VALUES (
  'Pro Plan',
  'Full access to all features',
  12.99,
  'month',
  '["All AI tools and templates", "Unlimited projects", "Priority support", "Advanced analytics"]'::jsonb
);