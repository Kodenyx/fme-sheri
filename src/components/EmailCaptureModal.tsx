import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Mail, Lock, Chrome } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthComplete: (user: User) => void;
  usageCount: number;
}

const EmailCaptureModal = ({ isOpen, onClose, onAuthComplete, usageCount }: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/tool`,
        }
      });

      if (error) throw error;

      toast({
        title: "Redirecting to Google...",
        description: "You'll be back in a moment!",
      });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/tool`,
        }
      });

      if (error) throw error;

      toast({
        title: "Check Your Email! 📧",
        description: "We sent you a magic link. Click it to sign in instantly.",
      });

      // Keep localStorage for backwards compatibility
      localStorage.setItem('userEmail', email);

      onClose();
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned from sign in');
      }

      // Keep localStorage for backwards compatibility
      localStorage.setItem('userEmail', email);

      // Call the onAuthComplete callback with the user
      onAuthComplete(data.user);
      
      toast({
        title: "Welcome Back! 👋",
        description: "You've successfully signed in.",
      });
      
      onClose();
      
      // Refresh the page to ensure auth state is fully synced
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Check if it's an invalid credentials error (likely no password set)
      if (error.message?.includes('Invalid login credentials')) {
        toast({
          title: "No Password Set",
          description: "This account was created without a password. Please use 'Send me a magic link instead' to sign in.",
          variant: "destructive",
        });
        // Automatically switch to magic link mode
        setShowMagicLink(true);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in. Please check your credentials.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectUrl = `${window.location.origin}/tool`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
          }
        }
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned from sign up');
      }

      // Keep localStorage for backwards compatibility
      localStorage.setItem('userEmail', email);

      // Call the onAuthComplete callback with the user
      onAuthComplete(data.user);
      
      toast({
        title: "Account Created! 🎉",
        description: "Welcome aboard! Refreshing...",
      });
      
      onClose();
      
      // Refresh the page to ensure auth state is fully synced
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('already registered')) {
        toast({
          title: "Account Exists",
          description: "This email is already registered.",
          variant: "destructive",
        });
        // Switch to sign-in mode
        setMode('signin');
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-6">
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              {mode === 'signup' ? '✨ Keep Going!' : '👋 Welcome Back!'}
            </DialogTitle>
            <DialogDescription className="text-center text-lg" style={{ color: '#A9D6D4' }}>
              {mode === 'signup' 
                ? 'Create your free account to unlock more rewrites' 
                : 'Sign in to continue using the tool'}
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 pb-8">
            {/* Google Sign In - Primary CTA */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full text-gray-800 font-bold text-lg py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 bg-white hover:bg-gray-50 border-0 mb-6"
            >
              <Chrome className="mr-3 h-5 w-5" />
              {isSubmitting ? "Signing in..." : "Continue with Google"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#A9D6D4' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-white" style={{ backgroundColor: '#0D4049' }}>
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email + Password Form or Magic Link Form */}
            <form className="space-y-4" onSubmit={showMagicLink ? handleMagicLink : (mode === 'signin' ? handleSignIn : handleEmailPasswordSignUp)}>
              {!showMagicLink && mode === 'signup' && (
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!showMagicLink && mode === 'signup'}
                  className="text-base py-5 px-5 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: '#A9D6D4' }}
                />
              )}
              
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base py-5 px-5 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                style={{ borderColor: '#A9D6D4' }}
              />

              {!showMagicLink && (
                <Input
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!showMagicLink}
                  minLength={6}
                  className="text-base py-5 px-5 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: '#A9D6D4' }}
                />
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-bold text-lg py-5 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0"
                style={{ backgroundColor: '#E19013' }}
              >
                {isSubmitting ? (
                  "Please wait..."
                ) : showMagicLink ? (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Magic Link
                  </>
                ) : mode === 'signin' ? (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Create My Account
                  </>
                )}
              </Button>

              {/* Toggle Magic Link and Sign In/Sign Up */}
              <div className="text-center space-y-2">
                {!showMagicLink && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'signin' ? 'signup' : 'signin');
                      setFirstName('');
                      setPassword('');
                    }}
                    className="text-sm font-medium hover:underline transition-colors block w-full"
                    style={{ color: '#A9D6D4' }}
                  >
                    {mode === 'signin' 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowMagicLink(!showMagicLink)}
                  className="text-sm font-medium hover:underline transition-colors block w-full"
                  style={{ color: '#A9D6D4' }}
                >
                  {showMagicLink ? "← Back to email/password" : "✉️ Send me a magic link instead"}
                </button>
              </div>

              <p className="text-center text-sm" style={{ color: '#A9D6D4' }}>
                💡 We'll email you the enhanced version too
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
