import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Tool = () => {
  const [emailType, setEmailType] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [improvedEmail, setImprovedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: emailType, draft: emailDraft }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImprovedEmail(data.result);
    } catch (error: any) {
      console.error("Error fetching improved email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate improved email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#3B1E5E' }}>
                Email Messaging Makeover
              </h1>
              <p className="text-xl md:text-2xl" style={{ color: '#89888E' }}>
                Transform your emails with proven frameworks from HubSpot's former Demand Lead
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xl font-semibold mb-4" style={{ color: '#3B1E5E' }}>
                    What type of email are you writing?
                  </label>
                  <Select value={emailType} onValueChange={setEmailType}>
                    <SelectTrigger className="text-lg py-6 px-6 border-2 rounded-xl" style={{ borderColor: '#A9D6D4' }}>
                      <SelectValue placeholder="Select email type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="re-engagement">Re-engagement (Follow up with leads)</SelectItem>
                      <SelectItem value="promotional">Promotional (Webinars, launches, events)</SelectItem>
                      <SelectItem value="cold-outreach">Cold Outreach (New prospects)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xl font-semibold mb-4" style={{ color: '#3B1E5E' }}>
                    Paste your email draft here:
                  </label>
                  <Textarea
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    placeholder="Paste your email content here..."
                    className="min-h-[200px] text-lg py-6 px-6 border-2 rounded-xl resize-none focus:ring-2"
                    style={{ borderColor: '#A9D6D4' }}
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading || !emailDraft.trim() || !emailType}
                  className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90"
                  style={{ backgroundColor: '#E19013' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Transforming Your Email...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-6 w-6" />
                      Fix My Email
                    </>
                  )}
                </Button>
              </form>

              {improvedEmail && (
                <div className="mt-12">
                  <h2 className="text-3xl font-bold mb-6" style={{ color: '#3B1E5E' }}>
                    Improved Email:
                  </h2>
                  <div className="bg-gray-100 rounded-xl p-6">
                    <p className="text-lg whitespace-pre-line" style={{ color: '#3B1E5E' }}>
                      {improvedEmail}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tool;
