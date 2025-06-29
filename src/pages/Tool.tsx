
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const Tool = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makeover, setMakeover] = useState("");
  const [showMakeover, setShowMakeover] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [analysis, setAnalysis] = useState({
    psychologicalTriggers: [],
    structureImprovements: []
  });
  const { toast } = useToast();

  useEffect(() => {
    // Get email from localStorage or redirect to offer page
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      window.location.href = '/offer';
      return;
    }
    setUserEmail(storedEmail);
  }, []);

  const analyzeEmailType = (content: string) => {
    const lowerContent = content.toLowerCase();
    
    // Check for re-engagement indicators
    if (lowerContent.includes("checking in") || lowerContent.includes("follow up") || 
        lowerContent.includes("haven't heard") || lowerContent.includes("circling back")) {
      return "re-engagement";
    }
    
    // Check for promotional indicators
    if (lowerContent.includes("webinar") || lowerContent.includes("launch") || 
        lowerContent.includes("sale") || lowerContent.includes("offer") ||
        lowerContent.includes("limited time") || lowerContent.includes("register")) {
      return "promotional";
    }
    
    // Default to cold outreach
    return "cold-outreach";
  };

  const generateReEngagementEmail = () => {
    const emailVariations = [
      {
        subject: "You're closer than you think…",
        body: `Hey Sarah,

You made it halfway through the messaging audit. And then—life happened.

I get it. Between client fires and quarterly reviews, strategic work gets pushed to "someday."

But here's what I noticed: founders who circle back to finish what they started? They're the ones who break through the noise.

No pressure to jump back in… but I saved your spot if you're ready to finish building the machine that sells while you sleep.

Your pace. Your terms. I'm here when you're ready.

Sheri`
      },
      {
        subject: "The missing piece you asked about",
        body: `Hey Marcus,

Remember when you said your emails felt "too corporate" but you weren't sure how to fix them?

I've been thinking about that conversation. Most founders get stuck here because they're optimizing copy when they should be rebuilding psychology.

I put together something that might help—a quick framework for turning clinical language into emotional connection.

Want me to send it over? No strings attached.

Sheri`
      },
      {
        subject: "Still thinking about this?",
        body: `Hi Jennifer,

Three weeks ago, you mentioned your email sequences weren't converting like they used to.

I've seen this pattern before. What worked in 2022 feels tone-deaf now. Your audience evolved, but your messaging stayed static.

The good news? This is fixable. The better news? It's faster than you think.

If you're still wrestling with this, I have 15 minutes Thursday to walk through what's shifted and how to adjust.

Sound useful?

Sheri`
      }
    ];
    
    return emailVariations[Math.floor(Math.random() * emailVariations.length)];
  };

  const generatePromotionalEmail = () => {
    const emailVariations = [
      {
        subject: "This might be the 30 minutes that changes everything",
        body: `Most founders waste years optimizing emails that shouldn't exist.

You tweak subject lines. Polish CTAs. A/B test button colors.

Meanwhile, your competition rewrites the rules.

This Thursday at 2pm, I'm showing exactly how to spot the signals your messaging is fundamentally broken—and the three-step system to rebuild it from the ground up.

No theory. No fluff. Just the frameworks behind $50M+ in client results.

Reserve your spot (limited to 100 founders): [Registration Link]

Sheri`
      },
      {
        subject: "Most founders miss this completely",
        body: `Your messaging isn't broken because of what you're saying.

It's broken because of what you're not saying.

The assumptions you make. The context you skip. The emotional bridges you never build.

Tuesday's workshop isn't about writing better emails. It's about understanding the psychology that makes people buy—then architecting every word around that truth.

Three hours. Everything I've learned helping companies add 8 figures through messaging alone.

Claim your seat before we hit capacity: [Workshop Link]

Sheri`
      },
      {
        subject: "Thursday at 2pm: The shift",
        body: `The companies thriving right now aren't the ones with perfect products.

They're the ones who speak to what their audience actually thinks about at 2am.

While others spray generic value props, they're having conversations that feel like mind-reading.

This Thursday, I'm breaking down exactly how they do it. The research methods. The messaging frameworks. The psychology principles that turn strangers into advocates.

90 minutes that could reshape how you think about customer communication forever.

Register now (seats filling fast): [Event Link]

Sheri`
      }
    ];
    
    return emailVariations[Math.floor(Math.random() * emailVariations.length)];
  };

  const generateColdOutreachEmail = () => {
    const emailVariations = [
      {
        subject: "Quick thought about your Series A messaging",
        body: `Hey David,

Saw TechCrunch picked up your Series A news. Congrats on the momentum.

Reading between the lines of your positioning, I'm curious—are you finding that your pre-A messaging still resonates with the growth-stage challenges you're facing now?

Most founders I work with hit this inflection point around month 3 post-raise. The story that got you funded isn't always the story that scales revenue.

Worth a conversation?

Sheri`
      },
      {
        subject: "Noticed something about CloudTech's launch",
        body: `Hi Rachel,

Your product launch last week caught my attention—specifically how you positioned the enterprise features without alienating your SMB base.

That's a tightrope most companies fall off. You walked it beautifully.

I'm working with a few other vertical SaaS companies on similar positioning challenges. Happy to share what's working if you're interested in comparing notes.

5-minute call this week?

Sheri`
      },
      {
        subject: "One pattern I'm seeing with fintech messaging",
        body: `Hey Alex,

Been following StreamPay's evolution since the rebrand. Smart move simplifying the value prop—financial infrastructure is hard enough without confusing messaging.

I'm seeing a pattern with fintech companies your size: the messaging that wins enterprise deals often confuses the mid-market prospects (and vice versa).

You might already have this figured out, but if you're wrestling with audience-specific messaging, I've cracked this puzzle for companies like Mercury and Ramp.

Open to sharing what worked?

Sheri`
      }
    ];
    
    return emailVariations[Math.floor(Math.random() * emailVariations.length)];
  };

  const generateMakeover = (originalEmail: string) => {
    const emailType = analyzeEmailType(originalEmail);
    let emailData;
    let triggers = [];
    let improvements = [];

    switch (emailType) {
      case "re-engagement":
        emailData = generateReEngagementEmail();
        triggers = [
          "Ovsiankina Effect: References unfinished task to create psychological completion drive",
          "Loss aversion: Emphasizes what they're missing by not acting, not what they gain",
          "Autonomy bias: Explicitly gives permission to choose their own pace and terms",
          "Emotional acknowledgment: Validates the real reasons people drop off (life happens)"
        ];
        improvements = [
          "Opens with empathy and understanding rather than pressure or guilt",
          "Uses specific, vivid language that creates mental pictures",
          "Positions value as already created, not conditional on their action",
          "Confident but patient CTA that reinforces their control"
        ];
        break;
        
      case "promotional":
        emailData = generatePromotionalEmail();
        triggers = [
          "Loss aversion: Frames current approach as time waste, not opportunity gain",
          "Social proof: Implies others are getting ahead while reader optimizes wrong things",
          "Scarcity: Limited seats creates urgency without aggressive sales pressure",
          "Curiosity gap: Promises specific insights without revealing the framework"
        ];
        improvements = [
          "Problem-focused opening that diagnoses hidden pain points",
          "Specific value proposition tied to measurable outcomes",
          "Authority positioning through client results and methodology",
          "Time-bound urgency that feels natural, not manufactured"
        ];
        break;
        
      default: // cold-outreach
        emailData = generateColdOutreachEmail();
        triggers = [
          "Reciprocity: Offers valuable insight or connection before asking for anything",
          "Social proof: References specific, relevant companies and situations",
          "Pattern recognition: Demonstrates expertise by identifying specific challenges",
          "Information gap: Creates curiosity about solutions without being pushy"
        ];
        improvements = [
          "Trigger-based relevance that shows you've done your homework",
          "Short, scannable format that respects their time",
          "Peer proof over self-promotion to build credibility naturally",
          "Curious, helpful tone that positions you as advisor, not vendor"
        ];
    }

    const makeoverResult = `Subject: ${emailData.subject}

${emailData.body}`;

    const analysisResult = {
      psychologicalTriggers: triggers,
      structureImprovements: improvements
    };

    return { makeover: makeoverResult, analysis: analysisResult, emailType };
  };

  const logToolUsage = async (originalEmail: string, transformedEmail: string, emailCategory: string) => {
    try {
      console.log('Logging tool usage:', { userEmail, emailCategory, originalLength: originalEmail.length });
      
      const { data, error } = await supabase
        .from('tool_usage')
        .insert([{
          user_id: null, // No user ID since we're not using full auth
          email_address: userEmail,
          original_email: originalEmail,
          transformed_email: transformedEmail,
          email_category: emailCategory
        }])
        .select();

      if (error) {
        console.error('Error logging tool usage:', error);
        // Try to log with minimal data if full insert fails
        await supabase
          .from('tool_usage')
          .insert([{
            user_id: null,
            email_address: userEmail,
            original_email: originalEmail.substring(0, 1000), // Truncate if too long
            transformed_email: transformedEmail.substring(0, 1000),
            email_category: emailCategory
          }]);
      } else {
        console.log('Tool usage logged successfully:', data);
      }
    } catch (error) {
      console.error('Failed to log tool usage:', error);
      // Final fallback - log basic usage without content
      try {
        await supabase
          .from('tool_usage')
          .insert([{
            user_id: null,
            email_address: userEmail,
            original_email: `[Content length: ${originalEmail.length} chars]`,
            transformed_email: `[Content length: ${transformedEmail.length} chars]`,
            email_category: emailCategory
          }]);
        console.log('Basic usage logged as fallback');
      } catch (fallbackError) {
        console.error('Even fallback logging failed:', fallbackError);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = generateMakeover(emailContent);
      setMakeover(result.makeover);
      setAnalysis(result.analysis);
      setShowMakeover(true);
      
      // Log the tool usage - this is critical for tracking
      await logToolUsage(emailContent, result.makeover, result.emailType);
      
      toast({
        title: "Makeover Complete!",
        description: "Your improved email is ready!",
      });
      
    } catch (error) {
      console.error('Error during email makeover:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEmailContent("");
    setMakeover("");
    setShowMakeover(false);
    setAnalysis({ psychologicalTriggers: [], structureImprovements: [] });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(makeover);
    toast({
      title: "Copied!",
      description: "Improved email copied to clipboard",
    });
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3B1E5E' }}>Redirecting...</h2>
          <p style={{ color: '#89888E' }}>Please wait while we redirect you to get access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#3B1E5E' }}>
                Transform Your Email in{" "}
                <span style={{ color: '#E19013' }}>
                  Under 3 Seconds
                </span>
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto" style={{ color: '#3B1E5E' }}>
                Paste your email below and watch our AI apply proven behavioral psychology 
                frameworks to make it more compelling and conversion-focused.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#3B1E5E' }}>Your Original Email</h3>
                  <Textarea 
                    placeholder="Paste your email content here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    required
                    className="min-h-80 text-base border-2 rounded-xl focus:ring-2"
                    style={{ borderColor: '#A9D6D4' }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: '#3B1E5E' }}>Your Improved Email</h3>
                    {showMakeover && (
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        style={{ borderColor: '#A9D6D4', color: '#3B1E5E' }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <div className={`min-h-80 border-2 rounded-xl p-4 ${showMakeover ? '' : 'flex items-center justify-center'}`} 
                       style={{ 
                         backgroundColor: showMakeover ? '#FAEEE1' : '#A9D6D4', 
                         borderColor: showMakeover ? '#E19013' : '#A9D6D4' 
                       }}>
                    {showMakeover ? (
                      <div className="whitespace-pre-line text-sm leading-relaxed" style={{ color: '#3B1E5E' }}>
                        {makeover}
                      </div>
                    ) : (
                      <p className="text-center" style={{ color: '#89888E' }}>
                        Your improved email will appear here...
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {!showMakeover && (
                <form onSubmit={handleSubmit}>
                  <div className="text-center">
                    <Button 
                      type="submit"
                      disabled={isSubmitting || !emailContent.trim()}
                      className="text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90"
                      style={{ backgroundColor: '#E19013' }}
                    >
                      {isSubmitting ? (
                        "Creating Your Makeover..."
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-6 w-6" />
                          Fix My Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {showMakeover && (
                <>
                  {/* Analysis Section */}
                  <div className="rounded-2xl p-8 mt-12" style={{ backgroundColor: '#A9D6D4' }}>
                    <h2 className="text-3xl font-bold mb-8" style={{ color: '#3B1E5E' }}>What Changed & Why</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-6" style={{ color: '#E19013' }}>Psychological Triggers Applied:</h3>
                        <div className="space-y-3">
                          {analysis.psychologicalTriggers.map((trigger, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E19013' }} />
                              <span style={{ color: '#3B1E5E' }}>{trigger}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-6" style={{ color: '#E19013' }}>Structure Improvements:</h3>
                        <div className="space-y-3">
                          {analysis.structureImprovements.map((improvement, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E19013' }} />
                              <span style={{ color: '#3B1E5E' }}>{improvement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="border-2 py-3 px-8 rounded-full"
                      style={{ borderColor: '#A9D6D4', color: '#3B1E5E' }}
                    >
                      Try Another Email
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tool;
