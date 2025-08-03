
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialCreditsFormProps {
  email: string | null;
  canClaimSocialBonus: boolean;
  socialBonusAmount: number;
  subscriptionStatus: string;
  oneTimeBonusClaimed: boolean;
  onCreditsAwarded: (credits: number) => void;
}

const SocialCreditsForm = ({
  email,
  canClaimSocialBonus,
  socialBonusAmount,
  subscriptionStatus,
  oneTimeBonusClaimed,
  onCreditsAwarded
}: SocialCreditsFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Image required",
        description: "Please upload a screenshot of your social media post",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email required",
        description: "Please use the tool first to register your email",
        variant: "destructive",
      });
      return;
    }

    if (!canClaimSocialBonus) {
      const message = subscriptionStatus === 'free' 
        ? "You've already claimed your one-time social bonus"
        : "You've already claimed your social bonus this month";
      toast({
        title: "Bonus already claimed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image (placeholder for now)
      const imageUrl = `placeholder-${Date.now()}`;

      // Submit with instant approval and credit award
      const { error } = await supabase
        .from('social_media_credits')
        .insert({
          email: email,
          image_url: imageUrl,
          status: 'approved',
          credits_awarded: socialBonusAmount,
          credit_type: subscriptionStatus === 'free' ? 'one_time' : 'monthly',
          reviewed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: `${socialBonusAmount} bonus credits added! 🎉`,
        description: `Your social media proof has been approved and ${socialBonusAmount} bonus credits have been added to your account!`,
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      
      // Notify parent component
      onCreditsAwarded(socialBonusAmount);

    } catch (error) {
      console.error('Error submitting proof:', error);
      toast({
        title: "Submission failed",
        description: `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInstructions = () => {
    if (subscriptionStatus === 'free') {
      if (oneTimeBonusClaimed) {
        return "You've already claimed your one-time social bonus. Upgrade to earn credits monthly!";
      }
      return `Earn ${socialBonusAmount} bonus credits (one-time only for free users)`;
    } else {
      return `Earn ${socialBonusAmount} bonus credits (monthly for subscribers)`;
    }
  };

  if (!canClaimSocialBonus) {
    return (
      <Card className="border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3" style={{ color: '#3B1E5E' }}>
            <Gift className="w-6 h-6" style={{ color: '#E19013' }} />
            Social Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">{getInstructions()}</p>
            {subscriptionStatus === 'free' && oneTimeBonusClaimed && (
              <Button
                className="text-white font-bold"
                style={{ backgroundColor: '#E19013' }}
              >
                Upgrade to Earn Monthly Credits
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3" style={{ color: '#3B1E5E' }}>
          <Gift className="w-6 h-6" style={{ color: '#E19013' }} />
          {getInstructions()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
              How to earn credits:
            </label>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm" style={{ color: '#3B1E5E' }}>
              <p>1. Share what you liked about the tool or what aspect of your email was improved for you!</p>
              <p>2. Tag @SheriOtto on Instagram or LinkedIn</p>
              <p>3. Upload a screenshot below</p>
              <p>4. Get {socialBonusAmount} bonus credits instantly!</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
              Upload Screenshot
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {previewUrl ? (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full h-32 object-contain mx-auto rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                  >
                    Choose Different Image
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Click to upload your screenshot</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !selectedFile}
            className="w-full text-white font-bold text-lg py-3 rounded-full"
            style={{ backgroundColor: '#E19013' }}
          >
            {isSubmitting ? "Adding Credits..." : `Get ${socialBonusAmount} Instant Bonus Credits`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialCreditsForm;
