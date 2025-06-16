/*
  # Add yearly Pro Plan

  1. Changes
    - Insert yearly Pro Plan with correct pricing
    - Ensure both monthly and yearly plans exist

  2. Security
    - No RLS changes needed as plans table already has proper policies
*/

-- Insert Yearly Pro Plan if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Pro Plan' AND interval = 'year') THEN
    INSERT INTO plans (name, description, price, interval, stripe_price_id, features, active)
    VALUES (
      'Pro Plan',
      'Full access to all features - Yearly',
      119.99,
      'year',
      'price_yearly_placeholder', -- Replace with your actual yearly price ID
      '["All AI tools", "Unlimited projects", "Priority support", "Advanced analytics"]'::jsonb,
      true
    );
  END IF;
END $$;

-- Ensure monthly Pro Plan exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Pro Plan' AND interval = 'month') THEN
    INSERT INTO plans (name, description, price, interval, stripe_price_id, features, active)
    VALUES (
      'Pro Plan',
      'Full access to all features - Monthly',
      12.99,
      'month',
      'price_monthly_placeholder', -- Replace with your actual monthly price ID
      '["All AI tools", "Unlimited projects", "Priority support", "Advanced analytics"]'::jsonb,
      true
    );
  END IF;
END $$;