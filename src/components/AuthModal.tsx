
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

const AuthModal = ({ 
  isOpen, 
  onClose, 
  initialEmail = "", 
  initialMode = 'signin',
  onSuccess 
}: AuthModalProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
    if (initialMode) {
      setIsSignUp(initialMode === 'signup');
    }
  }, [initialEmail, initialMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // For signup mode, we're actually updating the password of an already created account
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });
        
        if (updateError) {
          // If update fails, try signing up normally
          const redirectUrl = `${window.location.origin}/`;
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: redirectUrl
            }
          });
          if (signUpError) throw signUpError;
        }
        
        toast({
          title: "Success!",
          description: "Your account is ready! You can now sign in.",
        });
        
        // Switch to sign in mode
        setIsSignUp(false);
        setPassword("");
        
      } else {
        // Sign in mode
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/tool");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              <User className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              {isSignUp ? "Set Your Password" : "Welcome back"}
            </DialogTitle>
            <p className="text-center text-lg" style={{ color: '#A9D6D4' }}>
              {isSignUp 
                ? "Create a secure password to complete your account setup" 
                : "Sign in to continue transforming your emails"
              }
            </p>
          </DialogHeader>

          <div className="px-8 pb-8">
            <form className="space-y-6" onSubmit={handleAuth}>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSignUp} // Disable email field in signup mode since it's pre-filled
                className="text-lg py-6 px-6 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                style={{ 
                  borderColor: '#A9D6D4'
                }}
              />
              <Input
                type="password"
                placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-lg py-6 px-6 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                style={{ 
                  borderColor: '#A9D6D4'
                }}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0"
                style={{ backgroundColor: '#E19013' }}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <LogIn className="mr-3 h-6 w-6" />
                    {isSignUp ? "Set Password" : "Sign In"}
                  </>
                )}
              </Button>

              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-lg font-medium hover:underline transition-colors"
                    style={{ color: '#A9D6D4' }}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
