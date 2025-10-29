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

    const { action, email, duration, notes, promoId, adminPassword } = await req.json();
    
    // Validate admin password for all operations
    const expectedPassword = Deno.env.get('ADMIN_PASSWORD');
    if (adminPassword !== expectedPassword) {
      console.error('Invalid admin password attempt');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('Promotional access action:', action, { email, duration, promoId });

    if (action === 'grant') {
      // Grant promotional access
      const expiresAt = new Date();
      
      // If duration is 0, set to 100 years in the future (lifetime access)
      if (duration === 0) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 100);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + duration);
      }

      const { data, error } = await supabase
        .from('promotional_access')
        .insert({
          email,
          duration_months: duration,
          expires_at: expiresAt.toISOString(),
          notes: notes || null,
          granted_by: null, // No user ID since admin password auth
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
