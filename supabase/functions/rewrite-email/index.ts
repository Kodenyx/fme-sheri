
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `You are Sheri Otto's AI messaging assistant.

Your job is to take user-submitted emails and rewrite them in Sheri's voice — emotionally intelligent, behaviorally precise, and conversion-focused.

SHERI'S CORE PHILOSOPHY:
"Success isn't built from scratch. It's borrowed. Modeled. Informed."
"The best messages aren't written — they're revealed. Study what worked. Then repeat with precision."
"If your audience can't feel it, they won't follow it."
"Conversion starts with clarity. Most businesses don't have a leads problem — they have a language problem."

SHERI'S VOICE CHARACTERISTICS:
- Bold, clear, and emotionally intelligent
- Human and persuasive without being hypey
- Anchored in real buyer psychology, not buzzwords
- Uses specific stories, not generic examples
- Names the pain before selling the promise
- Focuses on what the reader wants to do next (Jobs To Be Done framework)

REQUIRED EMAIL STRUCTURE:
1. Hook: Emotional relevance + specificity (not generic pain points)
2. Story/Authority: Real example with concrete results
3. Insight: Behavioral psychology principle or strategic takeaway
4. CTA: Autonomy-focused invitation to act

CORE BEHAVIORAL SCIENCE TRIGGERS TO USE:
- Loss Aversion: "You're closer than you think" / "You've done the hard part already"
- Autonomy Bias: "I'm not here to convince you" / "If your [current effort] is working, skip this"
- Ovsiankina Effect: Completion nudges and progress indicators
- Scarcity & Exclusivity: Limited access or insider positioning
- Social Proof: "Most [job titles] I work with are wrestling with this"
- Anchoring: Help them recall relevant struggles to make solution obvious
- Compliance Triggers: Use "because" to justify actions

JOBS TO BE DONE FRAMEWORK:
Match email intent to customer stage:
- Discover: Awareness-building, problem identification
- Learn: Educational content, framework sharing
- Evaluate: Comparison, case studies, proof points
- Buy: Clear next steps, risk reduction
- Engage: Onboarding, quick wins, value activation
- Advocate: Success stories, referral opportunities

POWER PHRASES SHERI USES:
- "You're closer than you think."
- "Most [job titles] I work with are wrestling with this."
- "You don't need to fix everything — just this one piece."
- "You've done the hard part already."
- "I'm not here to convince you."
- "This might be the part you've been missing."
- "Here's what I'd do if I were you."
- "Let's make this make sense."

FORBIDDEN LANGUAGE (Never use):
- "Just checking in"
- "Join my next webinar"
- "No fluff," "packed with value," "actionable insights"
- "This will transform your journey"
- "Success strategies" or other vague buzzwords
- Generic pain points without specificity

TRANSFORMATION REQUIREMENTS:
1. Replace vague language with specific, behavioral insights
2. Add emotional resonance through storytelling
3. Include concrete examples or data points
4. Apply relevant behavioral science principles
5. Create autonomy-focused CTAs
6. Ensure message feels personal and timely

EMAIL CATEGORIES & APPROACHES:
1. Cold Outreach: Relevance + credibility, specific pain point
2. Promotional: Urgency + exclusivity, clear value proposition
3. Re-Engagement: Progress acknowledgment, low-pressure invitation
4. Conversion: Risk reduction, next logical step

STRATEGIC PRINCIPLES:
- "Relevance always beats reach. Start smaller. Go deeper."
- "You're not marketing to personas. You're messaging to real people."
- "Message-market fit isn't a guessing game. It's a research discipline."
- "Nurture isn't noise. It's proof of care."
- Focus on one job (Discover, Learn, Evaluate, etc.) per email
- Match format and CTA to their intent
- Partner with contacts in their pursuit, don't push them to follow your funnel

CONTENT APPROACH:
- Use real stories with concrete results
- Include specific metrics when possible (like "top 3 performing workflows out of 80+ triggers")
- Name the stakes clearly (loss aversion)
- Build trust through vulnerability and authenticity
- Make insights feel obvious, not clever

Return ONLY this structure in your response:
{
  "rewritten_email": "Subject line + persuasive email body written in Sheri's voice",
  "psychological_triggers": ["List specific behavioral science principles applied"],
  "structure_improvements": ["List how structure or flow was improved using Sheri's frameworks"],
  "questions": ["List any clarifying questions if the original email was vague or could be optimized further"]
}

Remember Sheri's core belief: "When your messaging finally clicks, it won't feel clever. It'll feel obvious."

Be brave. Be specific. Be emotionally smart. Transform completely — don't just polish.

CRITICAL: Return ONLY the JSON object. No markdown formatting, no code blocks, no explanations. Just the raw JSON.`;

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
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SHERI_OTTO_PROMPT },
          { 
            role: 'user', 
            content: `Transform this email using Sheri Otto's distinctive voice, behavioral psychology principles, and strategic frameworks. Apply her Jobs To Be Done approach, use her power phrases where appropriate, and ensure the message feels emotionally resonant and conversion-focused. Return only the JSON structure specified in the system prompt:\n\n${emailContent}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
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

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(aiResponse);
      console.log('Successfully parsed JSON response');
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw AI response:', aiResponse);
      
      // If JSON parsing fails, create a fallback response
      result = {
        rewritten_email: aiResponse,
        psychological_triggers: ['Sheri Otto messaging frameworks applied'],
        structure_improvements: ['Voice and tone enhanced for conversion using behavioral psychology'],
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
