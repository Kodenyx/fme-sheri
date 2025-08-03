
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
    "60 optimized rewrites/month",
    "Proven conversion triggers + sales frameworks",
    "Bonus: FixMyEmail Pro mini-course - lifetime access",
    "Priority support & feature feedback access"
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
              You're Already In – Let It Compound
            </DialogTitle>
            <DialogDescription className="text-center text-lg mb-4" style={{ color: '#A9D6D4' }}>
              Because you made it this far, you've unlocked Founders Access at our lowest rate ever.
            </DialogDescription>
            
            {/* Urgency Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">
                Only 30 spots. This rate will never return.
              </span>
            </div>
          </DialogHeader>

          <div className="px-8 pb-8">
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg line-through text-gray-400">$19.97/month</span>
                  <span className="text-3xl font-bold text-white">$9.97/month</span>
                </div>
                <div className="text-sm" style={{ color: '#A9D6D4' }}>Founders Rate</div>
              </div>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
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
              Claim My Founders Rate - $9.97/month
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
