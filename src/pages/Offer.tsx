
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";

const Offer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalEmail, setAuthModalEmail] = useState("");
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, try to sign up the user - if they already exist in auth, this will fail
      const redirectUrl = `${window.location.origin}/`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'temp-password-' + Math.random().toString(36),
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      // If signup succeeded, also add to email_leads (ignore duplicates)
      if (!signUpError) {
        await supabase
          .from('email_leads')
          .insert([{ email }])
          .then(() => {
            // Success - new user created
            toast({
              title: "Account Created!",
              description: "Complete your signup to access the tool...",
            });
            
            setAuthModalEmail(email);
            setAuthModalMode('signup');
            setShowAuthModal(true);
          })
          .catch(() => {
            // Email already in leads table but user was created successfully
            toast({
              title: "Account Created!",
              description: "Complete your signup to access the tool...",
            });
            
            setAuthModalEmail(email);
            setAuthModalMode('signup');
            setShowAuthModal(true);
          });
      } else {
        // Check if it's because user already exists
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
          toast({
            title: "Account Already Exists",
            description: "This email already has an account. Please sign in instead.",
          });
          
          setAuthModalEmail(email);
          setAuthModalMode('signin');
          setShowAuthModal(true);
        } else {
          throw signUpError;
        }
      }

    } catch (error: any) {
      console.error('Error during signup process:', error);
      toast({
        title: "Error",
        description: error.message || "There was an issue creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: '#0D4049' }}>
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-base md:text-lg mb-6 font-medium" style={{ color: '#A9D6D4' }}>
                Before you send another forgettable email…
              </p>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
                Get the tool that rewrites your message, like{" "}
                <span style={{ color: '#E19013' }}>
                  Sheri would
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-12 text-white max-w-3xl mx-auto">
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
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#0D4049' }}>
                    Ready to Transform Your Emails?
                  </h2>
                  <p className="text-lg" style={{ color: '#536357' }}>
                    Enter your email to create your account and get instant access
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
                      style={{ 
                        borderColor: '#A9D6D4'
                      }}
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90"
                    style={{ backgroundColor: '#E19013' }}
                  >
                    {isSubmitting ? (
                      "Setting Up Your Account..."
                    ) : (
                      <>
                        <Zap className="mr-3 h-6 w-6" />
                        Create Account & Get Access
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialEmail={authModalEmail}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Offer;
