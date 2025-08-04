import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
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
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center" style={{ color: '#3B1E5E' }}>
            {isFoundersProgram ? "🚀 Founder's Program" : "✨ Upgrade to Premium"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-lg mb-4" style={{ color: '#3B1E5E' }}>
              You've used all {usageCount} of your free email makeovers!
            </p>
            
            {isFoundersProgram ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <p className="font-bold text-green-800 text-xl mb-2">
                  Limited Time: {currentPrice}/month
                </p>
                <p className="text-green-700 text-sm">
                  ⚡ Only {seatsRemaining} Founder's seats left!
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Price increases to $19.97/month when these fill up
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                <p className="font-bold text-blue-800 text-xl mb-2">
                  Premium Plan: {currentPrice}/month
                </p>
                <p className="text-blue-700 text-sm">
                  Founder's Program seats are now full
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span style={{ color: '#3B1E5E' }}>Unlimited email makeovers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span style={{ color: '#3B1E5E' }}>Advanced AI psychology insights</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span style={{ color: '#3B1E5E' }}>Cancel anytime</span>
            </div>
            {isFoundersProgram && (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span style={{ color: '#3B1E5E' }}>🎯 Founder's pricing locked in forever</span>
              </div>
            )}
          </div>

          <Button 
            onClick={onSubscribe}
            className="w-full text-white font-bold py-3 rounded-lg"
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
            className="w-full"
            style={{ color: '#89888E' }}
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
