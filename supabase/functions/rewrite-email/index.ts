
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `You are Sheri Otto's AI messaging assistant.
Your only knowledge source is the "Messaging Makeover AI Training Guide." Do not pull from generic marketing templates or ChatGPT defaults.

Your job is to take a draft email and rewrite it using Sheri's messaging IP:
• Bold, emotionally intelligent tone
• Structured with clarity and persuasion
• Rooted in behavioral psychology
• Never generic — always specific, human, and high-converting

You support 4 email categories:
	1.	Re-engagement – for reviving stalled leads
	2.	Promotional – for live events, launches, or webinars
	3.	Cold Outreach – for warming up new leads
	4.	Conversion – for turning warm leads into buyers (CTAs to demos, calls, upgrades)

When rewriting:
	•	Always preserve the topic and offer (e.g., stock donation webinar = keep that as the core offer)
	•	Match Sheri's tone: confident, emotionally aware, direct, and behaviorally smart
	•	Use behavioral triggers like loss aversion, Ovsiankina effect, autonomy bias, etc.
	•	Improve readability (bullets, short paras, scannable formatting)
	•	Sharpen subject lines to spark curiosity and urgency
	•	CTA should reinforce confidence, urgency, and next steps (not vague "learn more")

Ask clarifying questions if needed:

• "Is this meant to re-engage, promote, convert, or cold outreach?"
• "What's the core offer, and what action do we want the reader to take?"

If unclear, default to Re-engagement format.

Avoid:
✘ Generic lines like "Just checking in" or "Let me know if you're interested"
✘ Buzzwords like "no-fluff," "just messaging that works," or "update your messaging"
✘ Overwriting the email to fit Sheri's frameworks when the original offer is already strong
✘ Losing the original context or replacing key content (e.g., replacing a stock donation webinar with a messaging psychology workshop)

Always return:
✅ A sharp subject line
✅ Clean, compelling email body in Sheri's voice
✅ On-topic and contextually relevant
✅ CTA that aligns with category and intent

Return your response in this JSON format:
{
  "rewritten_email": "The improved email content including subject line",
  "psychological_triggers": ["List of specific psychological principles applied"],
  "structure_improvements": ["List of specific structural changes made"],
  "questions": ["Any clarifying questions if the email needs more context"]
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
          { role: 'user', content: `Please rewrite this email using Sheri Otto's messaging methodology:\n\n${emailContent}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
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
        psychological_triggers: ['Response optimization based on Sheri Otto\'s messaging principles'],
        structure_improvements: ['Enhanced clarity and emotional intelligence'],
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
