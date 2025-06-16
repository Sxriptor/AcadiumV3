import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.11.0'

const stripe = new Stripe(
  Deno.env.get('STRIPE_SECRET_KEY')!,
  {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  }
)

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')
  const body = await request.text()
  
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message)
    return new Response(err.message, { status: 400 })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  console.log(`🔔 Event received: ${receivedEvent.type}`)

  try {
    switch (receivedEvent.type) {
      case 'checkout.session.completed':
        const session = receivedEvent.data.object
        console.log('Processing checkout session:', session.id)
        
        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        console.log('Retrieved subscription:', subscription.id)
        
        // Get the price to determine which plan
        const price = await stripe.prices.retrieve(subscription.items.data[0].price.id)
        console.log('Retrieved price:', price.id)
        
        // Find the plan in our database
        const { data: plan, error: planError } = await supabaseAdmin
          .from('plans')
          .select('id')
          .eq('stripe_price_id', price.id)
          .single()

        if (planError || !plan) {
          console.error('Plan not found for price:', price.id, planError)
          throw new Error(`Plan not found for price ${price.id}`)
        }

        console.log('Found plan:', plan.id)

        // Get user ID from session metadata
        const userId = session.metadata?.user_id
        if (!userId) {
          console.error('No user_id in session metadata')
          throw new Error('No user_id found in session metadata')
        }

        console.log('Processing subscription for user:', userId)

        // Create or update subscription
        const { error: subscriptionError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_id: plan.id,
            status: subscription.status,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })

        if (subscriptionError) {
          console.error('Error creating/updating subscription:', subscriptionError)
          throw subscriptionError
        }

        console.log(`✅ Subscription created/updated for user ${userId}`)
        break

      case 'customer.subscription.updated':
        const updatedSubscription = receivedEvent.data.object
        console.log('Updating subscription:', updatedSubscription.id)
        
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: updatedSubscription.status,
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: updatedSubscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', updatedSubscription.id)

        if (updateError) {
          console.error('Error updating subscription:', updateError)
          throw updateError
        }

        console.log(`✅ Subscription updated: ${updatedSubscription.id}`)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = receivedEvent.data.object
        console.log('Deleting subscription:', deletedSubscription.id)
        
        const { error: deleteError } = await supabaseAdmin
          .from('subscriptions')
          .update({ 
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', deletedSubscription.id)

        if (deleteError) {
          console.error('Error canceling subscription:', deleteError)
          throw deleteError
        }

        console.log(`✅ Subscription canceled: ${deletedSubscription.id}`)
        break

      case 'invoice.payment_succeeded':
        const invoice = receivedEvent.data.object
        console.log('Payment succeeded for subscription:', invoice.subscription)
        
        // Update subscription status to active if payment succeeded
        if (invoice.subscription) {
          const { error: paymentError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (paymentError) {
            console.error('Error updating subscription after payment:', paymentError)
          } else {
            console.log(`✅ Subscription activated after payment: ${invoice.subscription}`)
          }
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = receivedEvent.data.object
        console.log('Payment failed for subscription:', failedInvoice.subscription)
        
        // Update subscription status to past_due if payment failed
        if (failedInvoice.subscription) {
          const { error: failedError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', failedInvoice.subscription)

          if (failedError) {
            console.error('Error updating subscription after failed payment:', failedError)
          } else {
            console.log(`✅ Subscription marked as past_due: ${failedInvoice.subscription}`)
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${receivedEvent.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(`Webhook handler failed: ${error.message}`, { status: 400 })
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})