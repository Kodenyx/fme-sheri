
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";

const Offer = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setIsRedirecting(true);
    
    toast({
      title: "Let's fix that email! 🎉",
      description: "Redirecting you to the tool now...",
    });
    
    setTimeout(() => {
      navigate("/tool");
    }, 1000);
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
              Fix your B2B email with frameworks that scaled demand at{" "}
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

      {/* CTA Section */}
      <section id="try-tool" className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#3B1E5E' }}>
                  Fix My Email Now!
                </h2>
              </div>

              <Button 
                onClick={handleGetStarted}
                disabled={isRedirecting}
                className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90"
                style={{ backgroundColor: '#E19013' }}
              >
                {isRedirecting ? (
                  "Getting Ready..."
                ) : (
                  <>
                    <Zap className="mr-3 h-6 w-6" />
                    Get Started Free
                  </>
                )}
              </Button>

              <p className="text-center text-xs mt-8 mb-2" style={{ color: '#89888E' }}>
                🧊 Cold Outreach | 📣 Promotional | 🔁 Re-Engagement | 🎯 Conversion
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

export default Offer;
