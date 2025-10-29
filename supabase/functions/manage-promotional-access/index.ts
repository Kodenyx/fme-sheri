import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, email, duration, notes, promoId } = await req.json();

    console.log('Promotional access action:', action, { email, duration, promoId });

    if (action === 'grant') {
      // Grant promotional access
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + duration);

      const { data, error } = await supabase
        .from('promotional_access')
        .insert({
          email,
          duration_months: duration,
          expires_at: expiresAt.toISOString(),
          notes: notes || null,
          granted_by: user.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Promotional access granted:', data);
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else if (action === 'revoke') {
      // Revoke promotional access
      const { data, error } = await supabase
        .from('promotional_access')
        .update({ is_active: false })
        .eq('id', promoId)
        .select()
        .single();

      if (error) throw error;

      console.log('Promotional access revoked:', data);
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else if (action === 'list') {
      // List all promotional access
      const { data, error } = await supabase
        .from('promotional_access')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Retrieved promotional access records:', data?.length);
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else {
      throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error managing promotional access:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
