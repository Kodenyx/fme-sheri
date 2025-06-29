import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Offer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('email_leads')
        .insert([{ email }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your email has been captured. Redirecting to the tool...",
      });

      // Redirect to tool page after successful submission
      setTimeout(() => {
        navigate('/tool');
      }, 1000);

    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg mb-6 text-gray-600 font-medium">
              Before you send another forgettable email…
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">
              Get the tool that rewrites your message, like{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] to-[#06B6D4]">
                Sheri would
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-12 text-gray-600 max-w-3xl mx-auto">
              Copy that clicks with how humans decide - so your audience doesn't just read, they respond
            </p>
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Ready to Transform Your Emails?
                </h2>
                <p className="text-lg text-gray-600">
                  Enter your email to get instant access to the messaging makeover tool
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-lg py-6 px-6 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#818CF8] to-[#06B6D4] hover:from-[#6366F1] hover:to-[#0891B2] text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105"
                >
                  {isSubmitting ? (
                    "Getting Your Access..."
                  ) : (
                    <>
                      <Zap className="mr-3 h-6 w-6" />
                      Get Instant Access
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offer;
