
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { submissionId, action } = await req.json()

    if (action === 'approve') {
      // Approve the submission and award credits
      const { data: submission, error: fetchError } = await supabase
        .from('social_media_credits')
        .select('*')
        .eq('id', submissionId)
        .single()

      if (fetchError) throw fetchError

      // Update submission status
      const { error: updateError } = await supabase
        .from('social_media_credits')
        .update({
          status: 'approved',
          credits_awarded: 15,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (updateError) throw updateError

      console.log('Approved social media submission:', submissionId)

      return new Response(
        JSON.stringify({ success: true, message: 'Submission approved and credits awarded' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (action === 'reject') {
      const { reason } = await req.json()
      
      // Reject the submission
      const { error: updateError } = await supabase
        .from('social_media_credits')
        .update({
          status: 'rejected',
          notes: reason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ success: true, message: 'Submission rejected' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )

  } catch (error) {
    console.error('Error processing social submission:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
