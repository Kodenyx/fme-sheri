
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  usageCount: number;
}

const PaywallModal = ({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  usageCount 
}: PaywallModalProps) => {
  const features = [
    "60 email makeovers per month",
    "Advanced psychological triggers + proven sales frameworks",
    "Bonus: Access to the FixMyEmail Pro Course",
    "Priority support & feature feedback access",
    "Optional: Free Monthly workshops to go deeper",
    "Cancel anytime, no questions asked"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              You've hit your free limit — but you're just getting started.
            </DialogTitle>
            <DialogDescription className="text-center text-lg mb-4" style={{ color: '#A9D6D4' }}>
              You've used FixMyEmail {usageCount} times. On your next use, access will require a paid plan.
            </DialogDescription>
            <DialogDescription className="text-center text-lg mb-4" style={{ color: '#A9D6D4' }}>
              🎉 For a limited time, you can lock in Founders Access at our lowest price ever — just $9.97/month (normally $19.97).
            </DialogDescription>
            
            {/* Urgency badges */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium text-green-400">
                  ✅ Only 30 spots available
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium text-green-400">
                  ✅ This rate will never be offered again
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium text-green-400">
                  ✅ You'll be grandfathered in — for life
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="px-8 pb-8">
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-white mb-2">
                  What's included in your Founders Membership:
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg line-through text-gray-400">$19.97</span>
                  <span className="text-3xl font-bold text-white">$9.97</span>
                </div>
                <div className="text-sm" style={{ color: '#A9D6D4' }}>per month • Founders pricing</div>
              </div>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={onSubscribe}
              className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0"
              style={{ backgroundColor: '#E19013' }}
            >
              Join Founders Program - $9.97/month
            </Button>

            <p className="text-center text-sm mt-4" style={{ color: '#A9D6D4' }}>
              Special pricing • Limited time • Cancel anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
