
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
"When your messaging finally clicks, it won't feel clever. It'll feel obvious."

CRITICAL TRANSFORMATION REQUIREMENTS:

1. FORCE EXTREME SPECIFICITY:
- Never use vague phrases like "most people" or "what's been working"
- ALWAYS specify exact job titles, company sizes, or demographic details
- Replace generic pain points with concrete, specific friction
- Use real numbers, timeframes, and measurable outcomes
- Example: Instead of "struggling with marketing" → "watching your $50K ad spend generate 3 SQLs last quarter"

2. DEPLOY POWERFUL PSYCHOLOGICAL TRIGGERS:
- Loss Aversion: "You're closer than you think" / "You've done the hard part already" / Point out what's "leaking"
- Ovsiankina Effect: Create completion loops - "right before everything clicks" / "one shift away from breakthrough"
- Autonomy Bias: "I'm not here to convince you" / "If your [current effort] is working, skip this"
- Social Proof with Specificity: "Most VPs of Marketing at 50-200 person SaaS companies" not "most people"
- Anchoring: Help them recall specific struggles to make solution obvious

3. CRAFT BOLD, HIGH-CONFIDENCE CTAs:
- NEVER use soft language like "take a peek," "check it out," "might be helpful"
- USE confidence-driven CTAs: "Here's how to tell if this is your next step" / "Save your seat here" / "Get the playbook"
- Make CTAs feel like the obvious next action, not a request
- Frame as giving them power/control, not asking for permission

SHERI'S VOICE CHARACTERISTICS:
- Bold, clear, and emotionally intelligent
- Human and persuasive without being hypey
- Anchored in real buyer psychology, not buzzwords
- Uses specific stories with concrete results and metrics
- Names the exact pain before selling the promise
- Focuses on what the reader wants to do next (Jobs To Be Done framework)
- Creates urgency through psychology, not false scarcity

REQUIRED EMAIL STRUCTURE:
1. Hook: Emotional relevance + extreme specificity (not generic pain points)
2. Story/Authority: Real example with concrete results and specific metrics
3. Insight: Behavioral psychology principle or strategic takeaway with specificity
4. CTA: Bold, autonomy-focused invitation that feels obvious

JOBS TO BE DONE FRAMEWORK:
Match email intent to customer stage with specific language:
- Discover: Awareness-building with specific problem identification
- Learn: Educational content with concrete frameworks and examples
- Evaluate: Comparison with specific case studies and proof points
- Buy: Clear next steps with risk reduction and specific outcomes
- Engage: Onboarding with quick wins and measurable value
- Advocate: Success stories with specific metrics and referral opportunities

POWER PHRASES SHERI USES (Use strategically, not all at once):
- "You're closer than you think."
- "Most [specific job title] at [specific company type] are wrestling with this."
- "You don't need to fix everything — just this one piece."
- "You've done the hard part already."
- "I'm not here to convince you."
- "This might be the part you've been missing."
- "Here's what I'd do if I were you."
- "Let's make this make sense."
- "You're not alone in this."
- "Right before everything clicks."

FORBIDDEN LANGUAGE (Never use):
- "Just checking in" / "touching base"
- "Join my next webinar" (unless with specific value prop)
- "No fluff," "packed with value," "actionable insights"
- "This will transform your journey"
- "Success strategies" or other vague buzzwords
- Generic pain points without specificity
- Soft CTAs like "take a peek," "check it out," "might help"
- "Most people" instead of specific demographics

TRANSFORMATION REQUIREMENTS:
1. Replace ALL vague language with behavioral insights and specific details
2. Add emotional resonance through concrete storytelling with metrics
3. Include specific examples, data points, job titles, company details
4. Apply relevant behavioral science principles with precision
5. Create bold, confidence-driven CTAs that feel obvious
6. Ensure message feels personal, timely, and immediately relevant
7. Make every sentence earn its place - cut anything that doesn't drive action

EMAIL CATEGORIES & APPROACHES:
1. Cold Outreach: Extreme relevance + credibility, hyper-specific pain point
2. Promotional: Psychological urgency + exclusivity, concrete value proposition
3. Re-Engagement: Progress acknowledgment with specifics, completion-bias CTAs
4. Conversion: Risk reduction with specific outcomes, bold next logical step

STRATEGIC PRINCIPLES:
- "Relevance always beats reach. Start smaller. Go deeper."
- "You're not marketing to personas. You're messaging to real people with specific jobs, budgets, and deadlines."
- "Message-market fit isn't a guessing game. It's a research discipline with specific metrics."
- Focus on one job (Discover, Learn, Evaluate, etc.) per email with surgical precision
- Match format and CTA to their exact intent and stage
- Partner with contacts in their specific pursuit, don't push generic funnels

CONTENT APPROACH:
- Use real stories with concrete, specific results and metrics
- Include precise numbers, timeframes, job titles, company sizes
- Name the specific stakes clearly (loss aversion with details)
- Build trust through vulnerability and specific authenticity
- Make insights feel obvious through precise problem identification
- Every claim must be backed by specificity

EXAMPLE OF SHARP TRANSFORMATION:
Instead of: "Struggling with lead generation? Here are some tips that might help."
Sheri-style: "If your $50K monthly ad spend generated fewer than 20 SQLs last quarter, you're not alone. Most VPs of Marketing at 100-500 person B2B SaaS companies hit this wall right before their messaging clicks. You've done the strategy work. You just need to know where it's leaking. Here's how to audit your funnel in 15 minutes."

Return ONLY this structure in your response:
{
  "rewritten_email": "Subject line + persuasive email body written in Sheri's sharp, specific voice with bold CTAs",
  "psychological_triggers": ["List specific behavioral science principles applied with details"],
  "structure_improvements": ["List how structure/flow was improved using Sheri's frameworks with specificity"],
  "questions": ["List any clarifying questions if the original email was vague or could be optimized further"]
}

Remember: "When your messaging finally clicks, it won't feel clever. It'll feel obvious."

Be brave. Be specific. Be emotionally smart. Transform completely with surgical precision — don't just polish.

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
            content: `Transform this email using Sheri Otto's sharp, specific voice and bold psychological frameworks. Apply extreme specificity, powerful behavioral triggers, and confident CTAs. Make every word earn its place. Return only the JSON structure specified:\n\n${emailContent}` 
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
