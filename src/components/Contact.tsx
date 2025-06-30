import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RewriteResponse {
  rewritten_email: string;
  psychological_triggers: string[];
  structure_improvements: string[];
  questions?: string[];
}

const Contact = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [makeover, setMakeover] = useState("");
  const [showMakeover, setShowMakeover] = useState(false);
  const [analysis, setAnalysis] = useState({
    psychologicalTriggers: [] as string[],
    structureImprovements: [] as string[],
    questions: [] as string[]
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Calling rewrite-email function...');
      
      const { data, error } = await supabase.functions.invoke('rewrite-email', {
        body: {
          emailContent: emailContent
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to rewrite email');
      }

      console.log('Function response:', data);
      
      setMakeover(data.rewritten_email);
      setAnalysis({
        psychologicalTriggers: data.psychological_triggers || [],
        structureImprovements: data.structure_improvements || [],
        questions: data.questions || []
      });
      setShowMakeover(true);
      
      toast({
        title: "Makeover Complete!",
        description: "Your AI-enhanced email is ready!",
      });
      
    } catch (error) {
      console.error('Error during email makeover:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
    setAnalysis({ psychologicalTriggers: [], structureImprovements: [], questions: [] });
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
              Transform Your Email{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] to-[#06B6D4]">
                in Under 3 Seconds
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
                        Your enhanced email will appear here...
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !emailContent.trim()}
                    className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] hover:from-[#6366F1] hover:to-[#0891B2] text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105"
                  >
                    {isSubmitting ? (
                      "Enhancing Your Email..."
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-6 w-6" />
                        Get My Email Enhancement
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

                  {analysis.questions && analysis.questions.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 text-blue-600">Questions for Better Results:</h3>
                      <div className="space-y-2">
                        {analysis.questions.map((question, index) => (
                          <div key={index} className="p-3 rounded-lg bg-yellow-50 text-yellow-800">
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-8 rounded-full"
                  >
                    Enhance Another Email
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
