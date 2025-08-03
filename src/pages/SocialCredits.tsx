
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import Navbar from "@/components/Navbar";
import SocialCreditsForm from "@/components/SocialCreditsForm";

const SocialCredits = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const { email, refreshUsageData } = useUsageTracking();
  const { 
    canClaimSocialBonus, 
    socialBonusAmount, 
    subscriptionStatus, 
    oneTimeBonusClaimed,
    updateBonusCreditsFromSocial,
    loadCreditData 
  } = useCreditSystem(email);

  const loadSubmissions = async () => {
    if (!email) return;

    try {
      const { data, error } = await supabase
        .from('social_media_credits')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleCreditsAwarded = async (credits: number) => {
    await updateBonusCreditsFromSocial(credits, subscriptionStatus === 'paid');
    await refreshUsageData();
    loadSubmissions();
  };

  useEffect(() => {
    loadSubmissions();
  }, [email]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#3B1E5E' }}>
              Earn <span style={{ color: '#E19013' }}>Bonus Credits</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#3B1E5E' }}>
              Tag us on social media and get extra email fixes!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Submission Form */}
            <SocialCreditsForm
              email={email}
              canClaimSocialBonus={canClaimSocialBonus}
              socialBonusAmount={socialBonusAmount}
              subscriptionStatus={subscriptionStatus}
              oneTimeBonusClaimed={oneTimeBonusClaimed}
              onCreditsAwarded={handleCreditsAwarded}
            />

            {/* Submissions History */}
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle style={{ color: '#3B1E5E' }}>Your Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No submissions yet</p>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({submission.credit_type === 'monthly' ? 'Monthly' : 'One-time'})
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {submission.status === 'approved' && (
                          <p className="text-sm text-green-600 font-medium">
                            +{submission.credits_awarded} bonus credits awarded!
                          </p>
                        )}
                        
                        {submission.status === 'rejected' && submission.notes && (
                          <p className="text-sm text-red-600">
                            Reason: {submission.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCredits;
