# Stripe Webhook Setup Instructions

## Problem
Your Stripe webhook isn't being called because it's not properly configured to point to your Supabase edge function.

## Solution

### 1. Get Your Supabase Edge Function URL
Your webhook URL should be:
```
https://kpacxfxggoutavjfqvbh.supabase.co/functions/v1/stripe-webhook
```

### 2. Configure Stripe Webhook in Stripe Dashboard

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter the endpoint URL: `https://kpacxfxggoutavjfqvbh.supabase.co/functions/v1/stripe-webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 3. Get the Webhook Signing Secret
1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_`)
3. Add this to your Supabase environment variables as `STRIPE_WEBHOOK_SECRET`

### 4. Set Environment Variables in Supabase
Go to your Supabase project settings > Edge Functions and set:
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
- `STRIPE_WEBHOOK_SECRET`: The webhook signing secret from step 3

### 5. Test the Webhook
1. Make a test payment
2. Check the Stripe webhook logs in your dashboard
3. Check the Supabase edge function logs
4. Verify the subscription is created in your database

## Common Issues

### Issue: Webhook not receiving events
- **Solution**: Make sure the webhook URL is exactly `https://kpacxfxggoutavjfqvbh.supabase.co/functions/v1/stripe-webhook`
- **Solution**: Ensure the webhook is enabled in Stripe dashboard

### Issue: Webhook signature verification fails
- **Solution**: Double-check the `STRIPE_WEBHOOK_SECRET` environment variable

### Issue: Database not updating
- **Solution**: Check that your `plans` table has a record with the correct `stripe_price_id`
- **Solution**: Verify the `user_id` is being passed correctly in the checkout session metadata

## Testing
You can test webhooks using Stripe CLI:
```bash
stripe listen --forward-to https://kpacxfxggoutavjfqvbh.supabase.co/functions/v1/stripe-webhook
```