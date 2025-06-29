
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
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to verify your account, or sign in if you already have an account.",
        });
      } else {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-[#818CF8] to-[#06B6D4] rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </DialogTitle>
          <p className="text-center text-sm text-gray-600">
            {isSignUp 
              ? "Complete your signup to access the Messaging Makeover AI tool" 
              : "Welcome back to Messaging Makeover AI"
            }
          </p>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleAuth}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12"
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#818CF8] to-[#06B6D4] hover:from-[#6366F1] hover:to-[#0891B2] text-white font-bold h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                {isSignUp ? "Complete Signup" : "Sign In"}
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
