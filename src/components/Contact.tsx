
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, CheckCircle2 } from "lucide-react";
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

    return `**BEFORE (Problems Identified):**
❌ Generic subject line that gets ignored
❌ No personalization or relevance  
❌ Weak or missing call-to-action
❌ No social proof or credibility
❌ Too salesy/pushy tone

**AFTER (Sherry's Makeover):**

**Subject:** ${improvedSubject}

${improvedBody}

**Why This Works:**
✅ Personalized hook that shows you've done research
✅ Identifies specific pain point they care about
✅ Includes social proof with specific metrics
✅ Soft CTA that doesn't feel pushy
✅ Professional yet conversational tone
✅ P.S. gives them an easy out (builds trust)`;
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
        description: "Your improved email is ready below. Scroll down to see the transformation!",
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
    <section id="tool" className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready for Your Email Makeover?
            </h2>
            <p className="text-xl text-gray-600">
              Paste your email below and watch Sherry's AI transform it instantly
            </p>
          </div>

          {!showMakeover ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email Address (optional)
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label htmlFor="emailContent" className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Your Email Content Here
                </label>
                <Textarea 
                  id="emailContent"
                  placeholder="Subject: Your current subject line

Hi [Name],

Paste your entire email here - subject line, body, CTA, everything. The AI will analyze it all and give you a complete makeover..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  required
                  className="min-h-48"
                />
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-black/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg"
              >
                {isSubmitting ? (
                  "Creating Your Makeover..."
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Get My Instant Makeover (FREE)
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-gray-500">
                🔒 We'll never share your content. Your makeover appears instantly below.
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Your Email Makeover is Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line text-gray-700 font-mono text-sm bg-white p-4 rounded border">
                    {makeover}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300"
                >
                  Try Another Email
                </Button>
                <Button 
                  onClick={() => navigator.clipboard.writeText(makeover)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Copy Improved Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
