
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import FAQs from "@/components/FAQs";

const Offer = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setIsRedirecting(true);
    
    toast({
      title: "Let's fix that email!",
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

  const scrollToFAQs = () => {
    const faqsElement = document.getElementById('faqs');
    if (faqsElement) {
      faqsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar 
        onTestimonialsClick={scrollToTestimonials} 
        onTryToolClick={scrollToTryTool}
        onFAQsClick={scrollToFAQs}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
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
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: '#3B1E5E' }}>
              An AI email conversion tool built by HubSpot's former demand lead.
            </p>

            <div className="max-w-md mx-auto">
              <Button 
                onClick={handleGetStarted}
                disabled={isRedirecting}
                className="w-full text-white font-bold text-xl py-6 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 mb-4"
                style={{ backgroundColor: '#E19013' }}
              >
                {isRedirecting ? (
                  "Getting Ready..."
                ) : (
                  <>
                    <Zap className="mr-2 h-6 w-6" />
                    Fix My Email Now
                  </>
                )}
              </Button>

              <p className="text-lg whitespace-nowrap" style={{ color: '#89888E' }}>
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

      {/* FAQs Section */}
      <div id="faqs">
        <FAQs />
      </div>
    </div>
  );
};

export default Offer;
