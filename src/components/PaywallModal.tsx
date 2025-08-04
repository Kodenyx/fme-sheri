
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";
import React from "react";

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
  isFoundersProgram = false,
  seatsRemaining = 0
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              You're Already In – Let It Compound
            </DialogTitle>
            <div className="text-center text-lg mb-6" style={{ color: '#A9D6D4' }}>
              You've used FixMyEmail {usageCount} times—on the {usageCount + 1}th, it's time to upgrade.
            </div>
          </DialogHeader>

          <div className="px-8 pb-8">
            {isFoundersProgram ? (
              <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'rgba(225, 144, 19, 0.1)', border: '2px solid #E19013' }}>
                <p className="font-bold text-white text-xl mb-2 text-center">
                  Limited Time: {currentPrice}/month
                </p>
                <p className="text-center text-sm" style={{ color: '#A9D6D4' }}>
                  ⚡ Only {seatsRemaining} Founder's seats left!
                </p>
                <p className="text-center text-xs mt-1" style={{ color: '#A9D6D4' }}>
                  Price increases to $19.97/month when these fill up
                </p>
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'rgba(169, 214, 212, 0.1)', border: '2px solid #A9D6D4' }}>
                <p className="font-bold text-white text-xl mb-2 text-center">
                  Premium Plan: {currentPrice}/month
                </p>
                <p className="text-center text-sm" style={{ color: '#A9D6D4' }}>
                  Founder's Program seats are now full
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#E19013' }} />
                <span className="text-white">Unlimited email makeovers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#E19013' }} />
                <span className="text-white">Advanced AI psychology insights</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#E19013' }} />
                <span className="text-white">Cancel anytime</span>
              </div>
              {isFoundersProgram && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#E19013' }} />
                  <span className="text-white">🎯 Founder's pricing locked in forever</span>
                </div>
              )}
            </div>

            <Button 
              onClick={onSubscribe}
              className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0 mb-4"
              style={{ backgroundColor: '#E19013' }}
            >
              {isFoundersProgram 
                ? `Join Founder's Program - ${currentPrice}/mo`
                : `Upgrade to Premium - ${currentPrice}/mo`
              }
            </Button>

            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-lg py-4 rounded-full hover:bg-transparent"
              style={{ color: '#A9D6D4' }}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
