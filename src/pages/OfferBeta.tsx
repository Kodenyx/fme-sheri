
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import { isBetaExpired } from "@/utils/betaUtils";

const OfferBeta = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if beta has expired and redirect immediately
  useEffect(() => {
    if (isBetaExpired()) {
      console.log('Beta period has expired, redirecting to main offer page');
      navigate("/offer", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Set beta user identifier in localStorage
      const betaUserId = `beta-user-${Date.now()}`;
      localStorage.setItem('userEmail', betaUserId);
      localStorage.setItem('isBetaUser', 'true');
      
      toast({
        title: "Welcome to Beta!",
        description: "You're all set! Redirecting you to the tool now...",
      });
      
      // Redirect to tool page
      setTimeout(() => {
        navigate("/tool");
      }, 1500);

    } catch (error: any) {
      console.error('Error during beta access:', error);
      toast({
        title: "Error",
        description: "There was an issue with your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTestimonials = () => {
    const testimonialsElement = document.getElementById('testimonials');
    if (testimonialsElement) {
      testimonialsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTryTool = () => {
    const tryToolElement = document.getElementById('try-tool');
    if (tryToolElement) {
      tryToolElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If beta has expired, don't render anything (will redirect)
  if (isBetaExpired()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar onTestimonialsClick={scrollToTestimonials} onTryToolClick={scrollToTryTool} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl md:text-2xl mb-6 font-medium" style={{ color: '#3B1E5E' }}>
              Before you send another forgettable email…
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ color: '#3B1E5E' }}>
              Fix your email with frameworks that scaled demand at{" "}
              <span style={{ color: '#E19013' }}>
                HubSpot
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#3B1E5E' }}>
              An AI email conversion tool built by HubSpot's former demand lead.
            </p>
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section id="try-tool" className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#3B1E5E' }}>
                  Fix My Email Now!
                </h2>
                <p className="text-lg mb-6" style={{ color: '#89888E' }}>
                  Beta access - click below to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="opacity-50 pointer-events-none">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    className="text-lg py-6 px-6 border-2 rounded-xl focus:ring-2 bg-gray-100"
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

              <p className="text-center text-xs mt-8 mb-2" style={{ color: '#89888E' }}>
                Cold Outreach | Promotional | Re-Engagement | Conversion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div id="testimonials">
        <Testimonials />
      </div>
    </div>
  );
};

export default OfferBeta;
