/*
  # Add Stripe Price IDs to Plans

  1. Updates
    - Add stripe_price_id to existing plans
    - These should match your actual Stripe price IDs

  2. Security
    - No changes to RLS policies needed
*/

-- Update existing plans with Stripe price IDs
-- Replace these with your actual Stripe price IDs from your Stripe dashboard

UPDATE plans 
SET stripe_price_id = 'price_1234567890' -- Replace with your Pro plan price ID
WHERE name = 'Pro Plan';

UPDATE plans 
SET stripe_price_id = 'price_0987654321' -- Replace with your Developer plan price ID  
WHERE name = 'Developer Plan';

-- Insert plans if they don't exist
INSERT INTO plans (name, description, price, interval, stripe_price_id, features, active)
VALUES 
  (
    'Pro Plan',
    'Full access to all features',
    12.99,
    'month',
    'price_1234567890', -- Replace with your actual price ID
    '["All AI tools", "Unlimited projects", "Priority support", "Advanced analytics"]'::jsonb,
    true
  ),
  (
    'Developer Plan', 
    'Special access for developers',
    0.00,
    'month',
    'price_0987654321', -- Replace with your actual price ID
    '["All Pro features", "Developer access", "Beta features"]'::jsonb,
    true
  )
ON CONFLICT (name) DO UPDATE SET
  stripe_price_id = EXCLUDED.stripe_price_id,
  features = EXCLUDED.features;