
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

  const generateMakeover = (originalEmail: string) => {
    // Simple makeover logic - in real implementation this would call an AI API
    const lines = originalEmail.split('\n');
    let subject = "";
    let body = "";
    
    // Extract subject line
    const subjectLine = lines.find(line => line.toLowerCase().startsWith('subject:'));
    if (subjectLine) {
      subject = subjectLine.replace(/^subject:\s*/i, '');
    }
    
    // Get body content (everything after subject)
    const subjectIndex = lines.findIndex(line => line.toLowerCase().startsWith('subject:'));
    body = lines.slice(subjectIndex + 1).join('\n').trim();

    // Generate improved version
    const improvedSubject = subject ? 
      `Quick question about [specific challenge they mentioned]` : 
      "Quick question about [specific pain point]";

    const improvedBody = `Hi [Name],

I noticed you mentioned [specific challenge] on [platform/context].

I've helped similar companies solve this exact issue - curious if you'd be open to a 15-minute conversation about it?

No pitch, just genuinely curious about your approach.

Best,
[Your name]`;

    const makeoverResult = `Subject: ${improvedSubject}

${improvedBody}`;

    // Generate analysis
    const analysisResult = {
      psychologicalTriggers: [
        "Added social proof reference",
        "Created curiosity gap",
        "Reduced pressure with \"no pitch\" statement",
        "Added specific value proposition"
      ],
      structureImprovements: [
        "Personalized subject line",
        "Clear, simple call-to-action",
        "Strategic P.S. for reinforcement",
        "Shorter, scannable format"
      ]
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

  return (
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
};

export default Contact;
