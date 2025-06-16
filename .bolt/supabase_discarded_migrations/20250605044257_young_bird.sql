/*
  # Add developer plan

  1. Changes
    - Add developer plan to plans table
    - Price set to 0 for developer plan
    - Special features for developers
*/

INSERT INTO plans (name, description, price, interval, features)
VALUES (
  'Developer Plan',
  'Special access for developers',
  0,
  'unlimited',
  '["All AI tools and templates", "Unlimited projects", "Priority support", "Advanced analytics", "Early access to new features", "Developer API access"]'::jsonb
);