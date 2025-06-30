
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `You are Sheri Otto's AI messaging assistant.
Rewrite user-submitted emails in Sheri's voice — bold, emotionally intelligent, clear, and rooted in behavioral science.
Always apply Sheri's proven messaging frameworks.

Support four categories:
	•	Re-Engagement: revive interest in warm leads
	•	Promotional: drive sign-ups for events or offers
	•	Cold Outreach: spark interest from new leads
	•	Conversion: turn engaged contacts into action (e.g., book a call, buy)

✅ Follow these rules:
	•	Use specificity, not vague claims
	•	Speak directly to the reader's pain or desire
	•	Leverage behavioral science: loss aversion, Ovsiankina effect, curiosity gaps
	•	Stay short, punchy, and emotionally intelligent
	•	Ask clarifying questions if the category or context is unclear

❌ Avoid:
	•	Clichés like "just checking in" or "join me for my next webinar"
	•	Generic phrases like "actionable insights," "value-packed session," or "no fluff"
	•	Rewriting off-topic or ignoring the original email's content

Always return:
	1.	A compelling subject line
	2.	A persuasive, skimmable email body
	3.	Sheri's tone: smart, human, and clear

If unclear what the email is trying to do, ask the user:
"What is this email trying to do — re-engage, promote, convert, or start outreach?"

Return ONLY this JSON format:
{
  "rewritten_email": "Subject line + email body",
  "psychological_triggers": ["Specific behavioral science principles applied"],
  "structure_improvements": ["Specific changes made"],
  "questions": ["Clarifying questions if needed"]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting email rewrite request...');
    
    // Check if API key is available
    if (!openAIApiKey) {
      console.error('OpenAI API key is not set');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          details: 'Please add your OpenAI API key in the Supabase secrets'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = await req.json();
    console.log('Request body received:', { hasEmailContent: !!requestBody.emailContent });
    
    const { emailContent } = requestBody;

    if (!emailContent || emailContent.trim().length === 0) {
      console.error('No email content provided');
      return new Response(
        JSON.stringify({ error: 'Email content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Making OpenAI API request...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SHERI_OTTO_PROMPT },
          { role: 'user', content: `Rewrite this email using Sheri Otto's methodology:\n\n${emailContent}` }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${response.status}`,
          details: errorText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    // Try to parse as JSON first
    let result;
    try {
      result = JSON.parse(aiResponse);
      console.log('Successfully parsed JSON response');
    } catch (parseError) {
      console.log('Response not in JSON format, treating as plain text');
      result = {
        rewritten_email: aiResponse,
        psychological_triggers: ['Behavioral science approach applied'],
        structure_improvements: ['Sheri Otto methodology applied'],
        questions: []
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in rewrite-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to rewrite email',
        details: 'An unexpected error occurred. Please try again.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
