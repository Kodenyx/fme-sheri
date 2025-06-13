
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makeover, setMakeover] = useState("");
  const [showMakeover, setShowMakeover] = useState(false);
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
      `🚀 ${subject.replace(/free|sale|buy now/gi, '').trim()} - Quick Question` : 
      "🚀 Quick Question About Your [Specific Pain Point]";

    const improvedBody = `Hi [First Name],

I noticed you're working on [specific problem they mentioned/industry challenge].

Most [their role/industry] I talk to struggle with [specific pain point related to their business].

I just created a simple [solution/resource] that helped [similar client/company] increase [specific metric] by [specific number]% in [timeframe].

Worth a 2-minute look?

[Simple yes/no question that moves them forward]

Best,
[Your name]

P.S. If this isn't relevant, just hit reply and let me know what would be more helpful.`;

    return `Subject: ${improvedSubject}

${improvedBody}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate processing
    setTimeout(() => {
      const generatedMakeover = generateMakeover(emailContent);
      setMakeover(generatedMakeover);
      setShowMakeover(true);
      
      toast({
        title: "Makeover Complete!",
        description: "Your improved email is ready!",
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  const handleReset = () => {
    setEmail("");
    setEmailContent("");
    setMakeover("");
    setShowMakeover(false);
  };

  return (
    <section id="tool" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Transform Your Email in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] to-[#06B6D4]">
                30 Seconds
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
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Original Email</h3>
                    <div className="min-h-80 border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="whitespace-pre-line text-gray-700 text-sm">
                        {emailContent}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
                      <CheckCircle2 className="mr-2 h-6 w-6" />
                      Your Improved Email
                    </h3>
                    <div className="min-h-80 border-2 border-green-200 rounded-xl p-4 bg-green-50">
                      <div className="whitespace-pre-line text-gray-700 text-sm">
                        {makeover}
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
                  <Button 
                    onClick={() => navigator.clipboard.writeText(makeover)}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full"
                  >
                    Copy Improved Email
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
