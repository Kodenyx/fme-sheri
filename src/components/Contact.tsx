import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "./AuthGuard";
import AuthPrompt from "./AuthPrompt";

const Contact = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makeover, setMakeover] = useState("");
  const [showMakeover, setShowMakeover] = useState(false);
  const [analysis, setAnalysis] = useState({
    psychologicalTriggers: [],
    structureImprovements: []
  });
  const { toast } = useToast();

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
    const subjects = [
      "You're closer than you think…",
      "The missing piece you asked about",
      "Still thinking about this?",
      "One quick thought"
    ];
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    const body = `Hey [Name],

You made it halfway. And then—life.

No pressure to jump back in… but here's a shortcut if you're ready to finish what you started:

[Insert resource or link]

Your pace. Your terms. I'm here if you need me.

Sheri`;

    return { subject, body };
  };

  const generatePromotionalEmail = () => {
    const subjects = [
      "This might be the 30 minutes that changes everything",
      "Most founders miss this completely",
      "The signal everyone's ignoring",
      "Thursday at 2pm: The shift"
    ];
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    const body = `Most founders waste years optimizing what they should've replaced.

This Thursday, I'll show you how to spot the signals and turn them into sales — live.

Reserve your spot (limited seats): [CTA]

Sheri`;

    return { subject, body };
  };

  const generateColdOutreachEmail = () => {
    const subjects = [
      "A quick thought about [insert goal they care about]",
      "Noticed something about [company]",
      "Quick question about your [specific challenge]",
      "One pattern I'm seeing"
    ];
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    const body = `Hey [Name],

Saw [X trigger], and had to reach out. Teams like yours are usually juggling [common friction].

I've seen one tweak work really well — especially when [insert peer proof].

Open to sharing more?

Sheri`;

    return { subject, body };
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
          "Ovsiankina Effect (unfinished tasks)",
          "Loss aversion framing",
          "Autonomy bias (your pace, your terms)",
          "Emotional acknowledgment of gap"
        ];
        improvements = [
          "Emotionally intelligent opening",
          "No pressure, high care approach",
          "Clear value bridge back to original interest",
          "Confident but patient CTA"
        ];
        break;
        
      case "promotional":
        emailData = generatePromotionalEmail();
        triggers = [
          "Loss aversion (waste years optimizing)",
          "Scarcity + exclusivity (limited seats)",
          "Social proof (what others miss)",
          "Curiosity gap (signals and sales)"
        ];
        improvements = [
          "Pain-focused opening",
          "Specific value proposition",
          "Time-bound urgency without pressure",
          "Authority positioning"
        ];
        break;
        
      default: // cold-outreach
        emailData = generateColdOutreachEmail();
        triggers = [
          "Reciprocity (offering insight first)",
          "Social proof (peer validation)",
          "Information gap (specific trigger)",
          "Empathy-driven personalization"
        ];
        improvements = [
          "Trigger-based relevance",
          "Short, scannable format",
          "Peer proof over self-promotion",
          "Curious, not pushy tone"
        ];
    }

    const makeoverResult = `Subject: ${emailData.subject}

${emailData.body}`;

    const analysisResult = {
      psychologicalTriggers: triggers,
      structureImprovements: improvements
    };

    return { makeover: makeoverResult, analysis: analysisResult };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate processing
    setTimeout(() => {
      const result = generateMakeover(emailContent);
      setMakeover(result.makeover);
      setAnalysis(result.analysis);
      setShowMakeover(true);
      
      toast({
        title: "Makeover Complete!",
        description: "Your improved email is ready!",
      });
      
      setIsSubmitting(false);
    }, 2000);
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

  const ToolContent = () => (
    <section id="tool" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Transform Your Email in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] to-[#06B6D4]">
                Under 3 Seconds
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Paste your email below and watch our AI apply proven behavioral psychology 
              frameworks to make it more compelling and conversion-focused.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {!showMakeover ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Original Email</h3>
                    <Textarea 
                      placeholder="Paste your email content here..."
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      required
                      className="min-h-80 text-base border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Improved Email</h3>
                    <div className="min-h-80 border-2 border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-center">
                      <p className="text-gray-400 text-center">
                        Your improved email will appear here...
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] hover:from-[#6366F1] hover:to-[#0891B2] text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105"
                  >
                    {isSubmitting ? (
                      "Creating Your Makeover..."
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-6 w-6" />
                        Get My Email Makeover
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Email Comparison */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Original Email</h3>
                    <div className="min-h-80 border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                        {emailContent}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">Your Improved Email</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          AI Enhanced
                        </span>
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-80 border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
                      <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                        {makeover}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Section */}
                <div className="bg-gray-50 rounded-2xl p-8 mt-12">
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">What Changed & Why</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-blue-600">Psychological Triggers Applied:</h3>
                      <div className="space-y-3">
                        {analysis.psychologicalTriggers.map((trigger, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{trigger}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-blue-600">Structure Improvements:</h3>
                      <div className="space-y-3">
                        {analysis.structureImprovements.map((improvement, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-8 rounded-full"
                  >
                    Try Another Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <AuthGuard fallback={<AuthPrompt />}>
      <ToolContent />
    </AuthGuard>
  );
};

export default Contact;
