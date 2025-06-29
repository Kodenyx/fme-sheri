
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Offer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, save the email to leads table
      await supabase
        .from('email_leads')
        .insert([{ email }])
        .select()
        .single();

      // Create a temporary user account with a random password
      const tempPassword = Math.random().toString(36).substring(2, 15);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/tool`
        }
      });

      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError;
      }

      // Store email in localStorage for tool usage tracking
      localStorage.setItem('userEmail', email);
      
      toast({
        title: "Welcome aboard! 🎉",
        description: "You're all set! Redirecting you to the tool now...",
      });
      
      // Redirect to tool page
      setTimeout(() => {
        navigate("/tool");
      }, 1500);

    } catch (error: any) {
      console.error('Error during signup process:', error);
      
      // If user already exists, still proceed to tool
      if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
        localStorage.setItem('userEmail', email);
        toast({
          title: "Welcome back!",
          description: "Redirecting to the tool...",
        });
        
        setTimeout(() => {
          navigate("/tool");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: error.message || "There was an issue with your request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg md:text-xl mb-6 font-medium" style={{ color: '#3B1E5E' }}>
              Before you send another forgettable email…
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ color: '#3B1E5E' }}>
              Fix your email with frameworks that scaled demand at{" "}
              <span style={{ color: '#E19013' }}>
                HubSpot
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#3B1E5E' }}>
              A Free, AI-Powered Tool Built By HubSpot's Former Demand Lead And Engineered To Convert.
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
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#3B1E5E' }}>
                  Fix My Email Now!
                </h2>
                <p className="text-lg" style={{ color: '#89888E' }}>
                  Enter your email to get instant access
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
                    className="text-lg py-6 px-6 border-2 rounded-xl focus:ring-2"
                    style={{ borderColor: '#A9D6D4' }}
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90"
                  style={{ backgroundColor: '#E19013' }}
                >
                  {isSubmitting ? (
                    "Setting Up Your Access..."
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
