import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('No user found')
    }

    // Get request body
    const { toolId, stepId, completed, notes } = await req.json()

    if (!toolId || !stepId) {
      throw new Error('Missing required parameters: toolId and stepId are required')
    }

    // Update user progress
    const { data, error } = await supabaseClient
      .from('user_learning_progress')
      .upsert({
        user_id: user.id,
        tool_id: toolId,
        step_id: stepId,
        completed: completed !== undefined ? completed : true,
        completed_at: completed !== undefined ? (completed ? new Date().toISOString() : null) : new Date().toISOString(),
        notes: notes || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,tool_id,step_id'
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error updating user progress:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})