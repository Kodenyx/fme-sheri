
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Clock, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  usageCount: number;
  currentPrice?: string;
  isFoundersProgram?: boolean;
  seatsRemaining?: number;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  usageCount, 
  currentPrice = "$9.97",
  isFoundersProgram = true,
  seatsRemaining = 30
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset loading state when modal opens/closes or when checkout completes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  // Reset loading state when user returns from checkout
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoading) {
        // User returned to the page, reset loading state
        setIsLoading(false);
        setError(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoading]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onSubscribe();
    } catch (err) {
      console.error('Checkout error:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to start checkout. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address to continue.';
        } else if (err.message.includes('email_invalid')) {
          errorMessage = 'The email address format is invalid. Please check and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const programName = isFoundersProgram ? "Founders Program" : "Premium Plan";
  const statusText = isFoundersProgram 
    ? `Only 30 founder spots available - secure yours now`
    : "Founder's Program is now full - Premium Plan available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              You've hit your free limit - but you're just getting started.
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8">
            <div className="text-center mb-6">
              <div className="text-lg mb-2" style={{ color: '#4ADE80' }}>
                Put this on one line: <span className="text-4xl font-bold text-white">{currentPrice}/month</span> <span className="line-through text-2xl" style={{ color: '#A9D6D4' }}>$19.97</span>
              </div>
              <div className="text-lg font-bold text-white mb-2">• locked in.</div>
              <div className="text-lg font-bold mb-6" style={{ color: '#E19013' }}>
                {statusText}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                <span className="text-white">60 email makeovers/month</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                <span className="text-white">Proven psychology + sales triggers</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                <span className="text-white">"What Changed & Why" breakdown</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                <span className="text-white">Lifetime FixMyEmail Pro course access</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                <span className="text-white">Early access to new features</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                <span className="text-white">Founders-only perks</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <Button 
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0 mb-4 disabled:opacity-70 disabled:transform-none"
              style={{ backgroundColor: '#E19013' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening checkout...
                </>
              ) : (
                `[Join Founder's Program - ${currentPrice}/month]`
              )}
            </Button>

            {!isLoading && (
              <div className="text-center text-sm" style={{ color: '#A9D6D4' }}>
                Special pricing - Limited availability - Cancel anytime
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
