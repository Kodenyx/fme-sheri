
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
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
  onEmailSubmit: (email: string) => void;
  usageCount: number;
}

const EmailCaptureModal = ({ 
  isOpen, 
  onClose, 
  onEmailSubmit, 
  usageCount 
}: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      onEmailSubmit(email.trim());
      onClose();
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 p-0 bg-transparent shadow-none">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#0D4049' }}>
          <DialogHeader className="p-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#E19013' }}>
              <Mail className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-3xl font-bold text-white mb-2">
              You're loving this tool!
            </DialogTitle>
            <DialogDescription className="text-center text-lg" style={{ color: '#A9D6D4' }}>
              This is your {usageCount === 1 ? '2nd' : usageCount === 2 ? '3rd' : `${usageCount + 1}th`} time using our email fixer. 
              Quick question: What's your email?
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-lg py-6 px-6 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                style={{ borderColor: '#A9D6D4' }}
              />

              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105 hover:opacity-90 border-0"
                style={{ backgroundColor: '#E19013' }}
              >
                {isSubmitting ? "Saving..." : "Continue to the tool"}
              </Button>
            </form>

            <p className="text-center text-sm mt-4" style={{ color: '#A9D6D4' }}>
              We'll email you tips (only the good stuff) and your free FixMyEmail Pro invite.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
