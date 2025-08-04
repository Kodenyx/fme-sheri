
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Clock, Loader2 } from "lucide-react";
import React, { useState } from "react";

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

  const handleSubscribe = () => {
    setIsLoading(true);
    onSubscribe();
  };

  const programName = isFoundersProgram ? "Founders Program" : "Premium Plan";
  const statusText = isFoundersProgram 
    ? `Limited Availability - only ${seatsRemaining} slots available.`
    : "Founder's Program is now full - Premium Plan available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              {isLoading ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <CreditCard className="h-8 w-8 text-white" />
              )}
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              {isLoading ? "Redirecting to secure checkout..." : "You've hit your free limit - but you're just getting started."}
            </DialogTitle>
            
            {!isLoading && (
              <div className="flex items-center justify-center gap-2 mb-6" style={{ color: '#E19013' }}>
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{statusText}</span>
              </div>
            )}
          </DialogHeader>

          <div className="px-8 pb-8">
            {!isLoading && (
              <>
                <div className="rounded-xl p-6 mb-6 text-center" style={{ backgroundColor: 'rgba(169, 214, 212, 0.1)' }}>
                  <div className="text-2xl mb-2" style={{ color: '#A9D6D4' }}>
                    <span className="line-through">$19.97</span>
                    <span className="text-4xl font-bold text-white ml-2">{currentPrice}</span>
                  </div>
                  <div className="text-lg" style={{ color: '#A9D6D4' }}>
                    per month • locked in.
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                    <span className="text-white">60 email makeovers per month</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                    <span className="text-white">Advanced psychological triggers + proven sales frameworks</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                    <span className="text-white">Bonus: Access to the FixMyEmail Pro Course</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                    <span className="text-white">Priority support & future feedback access</span>
                  </div>
                  {isFoundersProgram && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                      <span className="text-white">Founders program access</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#4ADE80' }} />
                    <span className="text-white">Cancel anytime, no questions asked</span>
                  </div>
                </div>
              </>
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
                  Setting up your checkout...
                </>
              ) : (
                `Join ${programName} - ${currentPrice}/month`
              )}
            </Button>

            {!isLoading && (
              <div className="text-center text-sm" style={{ color: '#A9D6D4' }}>
                Special pricing • Limited time • Cancel anytime
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
