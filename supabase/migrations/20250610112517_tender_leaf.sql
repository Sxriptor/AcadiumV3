/*
  # Update plans with Stripe price IDs

  1. Changes
    - Add Stripe price IDs to existing plans
    - Insert plans if they don't exist
    - Handle conflicts properly without requiring unique constraints

  2. Security
    - No RLS changes needed as plans table already has proper policies
*/

-- First, try to update existing plans
UPDATE plans 
SET stripe_price_id = 'price_1234567890' -- Replace with your Pro plan price ID
WHERE name = 'Pro Plan' AND stripe_price_id IS NULL;

UPDATE plans 
SET stripe_price_id = 'price_0987654321' -- Replace with your Developer plan price ID  
WHERE name = 'Developer Plan' AND stripe_price_id IS NULL;

-- Insert Pro Plan if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Pro Plan') THEN
    INSERT INTO plans (name, description, price, interval, stripe_price_id, features, active)
    VALUES (
      'Pro Plan',
      'Full access to all features',
      12.99,
      'month',
      'price_1234567890', -- Replace with your actual price ID
      '["All AI tools", "Unlimited projects", "Priority support", "Advanced analytics"]'::jsonb,
      true
    );
  END IF;
END $$;

-- Insert Developer Plan if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Developer Plan') THEN
    INSERT INTO plans (name, description, price, interval, stripe_price_id, features, active)
    VALUES (
      'Developer Plan', 
      'Special access for developers',
      0.00,
      'month',
      'price_0987654321', -- Replace with your actual price ID
      '["All Pro features", "Developer access", "Beta features"]'::jsonb,
      true
    );
  END IF;
END $$;

-- Update features for existing plans if needed
UPDATE plans 
SET features = '["All AI tools", "Unlimited projects", "Priority support", "Advanced analytics"]'::jsonb
WHERE name = 'Pro Plan' AND features IS NULL;

UPDATE plans 
SET features = '["All Pro features", "Developer access", "Beta features"]'::jsonb
WHERE name = 'Developer Plan' AND features IS NULL;