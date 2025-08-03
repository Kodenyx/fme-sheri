import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UsageData {
  usageCount: number;
  monthlyUsage: number;
  bonusCredits: number;
  email: string | null;
  isSubscribed: boolean;
  needsEmailCapture: boolean;
  needsPaywall: boolean;
  loading: boolean;
  monthlyLimit: number;
  effectiveMonthlyLimit: number;
  isBetaUser: boolean;
}

export const useUsageTracking = () => {
  const [usageData, setUsageData] = useState<UsageData>({
    usageCount: 0,
    monthlyUsage: 0,
    bonusCredits: 0,
    email: null,
    isSubscribed: false,
    needsEmailCapture: false,
    needsPaywall: false,
    loading: true,
    monthlyLimit: 60,
    effectiveMonthlyLimit: 60,
    isBetaUser: false,
  });
  const { toast } = useToast();

  const getStoredEmail = (): string | null => {
    return localStorage.getItem('userEmail');
  };

  const checkIfBetaUser = (): boolean => {
    const isBeta = localStorage.getItem('isBetaUser') === 'true';
    const email = getStoredEmail();
    const isBetaEmail = email?.startsWith('beta-user-');
    
    console.log('Beta user check:', { isBeta, email, isBetaEmail, result: isBeta || isBetaEmail || false });
    
    return isBeta || isBetaEmail || false;
  };

  const getLocalUsageCount = (): number => {
    const stored = localStorage.getItem('toolUsageCount');
    return stored ? parseInt(stored, 10) : 0;
  };

  const setLocalUsageCount = (count: number) => {
    localStorage.setItem('toolUsageCount', count.toString());
  };

  const getMonthlyUsage = (): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const key = `monthlyUsage_${currentYear}_${currentMonth}`;
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  };

  const setMonthlyUsage = (count: number) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const key = `monthlyUsage_${currentYear}_${currentMonth}`;
    localStorage.setItem(key, count.toString());
  };

  const checkSubscription = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { email }
      });
      
      if (error) {
        console.error('Error checking subscription:', error);
        return false;
      }
      
      return data?.subscribed || false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  };

  const getUsageFromDatabase = async (email: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('user_usage_tracking')
        .select('usage_count')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching usage:', error);
        return 0;
      }
      
      return data?.usage_count || 0;
    } catch (error) {
      console.error('Error fetching usage:', error);
      return 0;
    }
  };

  const updateUsageInDatabase = async (email: string, newCount: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_usage_tracking')
        .upsert({
          email,
          usage_count: newCount,
          last_used_at: new Date().toISOString(),
        }, { onConflict: 'email' });
      
      if (error) {
        console.error('Error updating usage:', error);
      }
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  };

  const getBonusCredits = async (email: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('user_usage_tracking')
        .select('bonus_credits')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching bonus credits:', error);
        return 0;
      }
      
      return data?.bonus_credits || 0;
    } catch (error) {
      console.error('Error fetching bonus credits:', error);
      return 0;
    }
  };

  const updateBonusCreditsFromApprovals = async (email: string): Promise<number> => {
    try {
      // Get all approved submissions for this email
      const { data: approvedSubmissions, error: submissionsError } = await supabase
        .from('social_media_credits')
        .select('*')
        .eq('email', email)
        .eq('status', 'approved');

      if (submissionsError) throw submissionsError;

      // Calculate total bonus credits (30 per approved submission)
      const totalBonusCredits = (approvedSubmissions || []).length * 30;

      // Update user_usage_tracking with the total bonus credits
      const { error: updateError } = await supabase
        .from('user_usage_tracking')
        .upsert({
          email: email,
          bonus_credits: totalBonusCredits,
          last_used_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (updateError) throw updateError;

      return totalBonusCredits;
    } catch (error) {
      console.error('Error updating bonus credits:', error);
      return 0;
    }
  };

  const loadUsageData = async () => {
    setUsageData(prev => ({ ...prev, loading: true }));
    
    const storedEmail = getStoredEmail();
    const localCount = getLocalUsageCount();
    const monthlyCount = getMonthlyUsage();
    const isBetaUser = checkIfBetaUser();
    
    console.log('LoadUsageData - Initial values:', { storedEmail, localCount, monthlyCount, isBetaUser });
    
    let actualCount = localCount;
    let isSubscribed = false;
    let bonusCredits = 0;
    
    if (storedEmail && !isBetaUser) {
      const dbCount = await getUsageFromDatabase(storedEmail);
      actualCount = Math.max(localCount, dbCount);
      isSubscribed = await checkSubscription(storedEmail);
      bonusCredits = await updateBonusCreditsFromApprovals(storedEmail);
    }
    
    // Calculate effective monthly limit (base limit + bonus credits)
    const effectiveMonthlyLimit = 60 + bonusCredits;
    
    // Beta users never need email capture or paywall
    let needsEmailCapture = false;
    let needsPaywall = false;
    
    if (!isBetaUser) {
      // Show email capture after 1st use when no email is stored
      needsEmailCapture = actualCount >= 1 && !storedEmail;
      
      // Fixed paywall logic: Users with bonus credits get extended free access
      if (!isSubscribed) {
        // For non-subscribers: check total usage against free limit + bonus credits
        const freeLimit = 5 + bonusCredits; // 5 free uses + any bonus credits earned
        needsPaywall = actualCount >= freeLimit;
      } else {
        // For subscribers: use monthly limit system
        needsPaywall = monthlyCount >= effectiveMonthlyLimit;
      }
    }
    
    console.log('Usage tracking debug:', {
      actualCount,
      monthlyCount,
      bonusCredits,
      effectiveMonthlyLimit,
      storedEmail,
      needsEmailCapture,
      needsPaywall,
      isSubscribed,
      isBetaUser,
      freeLimit: 5 + bonusCredits
    });
    
    setUsageData({
      usageCount: actualCount,
      monthlyUsage: monthlyCount,
      bonusCredits: bonusCredits,
      email: storedEmail,
      isSubscribed,
      needsEmailCapture,
      needsPaywall,
      loading: false,
      monthlyLimit: 60,
      effectiveMonthlyLimit: effectiveMonthlyLimit,
      isBetaUser,
    });
  };

  const incrementUsage = async (email?: string) => {
    const currentEmail = email || getStoredEmail();
    const newCount = usageData.usageCount + 1;
    const newMonthlyCount = usageData.monthlyUsage + 1;
    
    setLocalUsageCount(newCount);
    setMonthlyUsage(newMonthlyCount);
    
    if (currentEmail && !usageData.isBetaUser) {
      await updateUsageInDatabase(currentEmail, newCount);
    }
    
    await loadUsageData();
  };

  const setUserEmail = (email: string) => {
    localStorage.setItem('userEmail', email);
    loadUsageData();
  };

  const createCheckoutSession = async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadUsageData();
  }, []);

  return {
    ...usageData,
    incrementUsage,
    setUserEmail,
    createCheckoutSession,
    refreshUsageData: loadUsageData,
  };
};
