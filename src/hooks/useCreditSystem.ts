
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePromotionalAccess } from "./usePromotionalAccess";

export interface CreditSystemData {
  usageCount: number;
  monthlyUsage: number;
  bonusCredits: number;
  isSubscribed: boolean;
  subscriptionStatus: string;
  oneTimeBonusClaimed: boolean;
  lastMonthlyClaimDate: string | null;
  canClaimSocialBonus: boolean;
  effectiveFreeLimit: number;
  remainingFreeUses: number;
  socialBonusAmount: number;
}

export const useCreditSystem = (email: string | null) => {
  const { hasPromotionalAccess, loading: promoLoading } = usePromotionalAccess(email);
  
  const [creditData, setCreditData] = useState<CreditSystemData>({
    usageCount: 0,
    monthlyUsage: 0,
    bonusCredits: 0,
    isSubscribed: false,
    subscriptionStatus: 'free',
    oneTimeBonusClaimed: false,
    lastMonthlyClaimDate: null,
    canClaimSocialBonus: false,
    effectiveFreeLimit: 5,
    remainingFreeUses: 5,
    socialBonusAmount: 10,
  });

  const checkSocialBonusEligibility = (
    subscriptionStatus: string,
    oneTimeBonusClaimed: boolean,
    lastMonthlyClaimDate: string | null
  ): { canClaim: boolean; bonusAmount: number } => {
    if (subscriptionStatus === 'free') {
      // Free users: can claim once, get 10 credits
      return {
        canClaim: !oneTimeBonusClaimed,
        bonusAmount: 10
      };
    } else {
      // Paid users: can claim once per month, get 30 credits
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      if (!lastMonthlyClaimDate) {
        return { canClaim: true, bonusAmount: 30 };
      }
      
      const lastClaim = new Date(lastMonthlyClaimDate);
      const lastClaimMonth = lastClaim.getMonth();
      const lastClaimYear = lastClaim.getFullYear();
      
      const canClaim = !(currentMonth === lastClaimMonth && currentYear === lastClaimYear);
      return { canClaim, bonusAmount: 30 };
    }
  };

  const loadCreditData = async () => {
    if (!email) {
      setCreditData(prev => ({
        ...prev,
        canClaimSocialBonus: false,
        socialBonusAmount: 10
      }));
      return;
    }

    try {
      // Get usage data
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage_tracking')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (usageError) {
        console.error('Error fetching usage data:', usageError);
        return;
      }

      // Get subscription status
      const { data: subscriptionData, error: subError } = await supabase.functions.invoke('check-subscription', {
        body: { email }
      });

      if (subError) {
        console.error('Error checking subscription:', subError);
        return;
      }

      const subscriptionStatus = (subscriptionData?.subscribed || hasPromotionalAccess) ? 'paid' : 'free';
      const isSubscribed = subscriptionData?.subscribed || hasPromotionalAccess || false;
      
      const oneTimeBonusClaimed = usageData?.one_time_bonus_claimed || false;
      const lastMonthlyClaimDate = usageData?.last_monthly_claim || null;
      const bonusCredits = usageData?.bonus_credits || 0;
      
      // Calculate social bonus eligibility
      const { canClaim, bonusAmount } = checkSocialBonusEligibility(
        subscriptionStatus,
        oneTimeBonusClaimed,
        lastMonthlyClaimDate
      );

      // Calculate effective limits
      const baseFreeLimit = 5;
      const effectiveFreeLimit = baseFreeLimit + (subscriptionStatus === 'free' ? bonusCredits : 0);
      const usageCount = usageData?.usage_count || 0;
      const remainingFreeUses = Math.max(0, effectiveFreeLimit - usageCount);

      setCreditData({
        usageCount,
        monthlyUsage: 0, // Will be calculated separately if needed
        bonusCredits,
        isSubscribed,
        subscriptionStatus,
        oneTimeBonusClaimed,
        lastMonthlyClaimDate,
        canClaimSocialBonus: canClaim,
        effectiveFreeLimit,
        remainingFreeUses,
        socialBonusAmount: bonusAmount,
      });

    } catch (error) {
      console.error('Error loading credit data:', error);
    }
  };

  const updateBonusCreditsFromSocial = async (creditsAwarded: number, isMonthly: boolean = false) => {
    if (!email) return;

    try {
      const updateData: any = {
        email: email,
        bonus_credits: creditData.bonusCredits + creditsAwarded,
        subscription_status: creditData.subscriptionStatus,
        last_used_at: new Date().toISOString(),
      };

      if (creditData.subscriptionStatus === 'free') {
        updateData.one_time_bonus_claimed = true;
      } else if (isMonthly) {
        updateData.last_monthly_claim = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_usage_tracking')
        .upsert(updateData, { onConflict: 'email' });

      if (error) {
        console.error('Error updating bonus credits:', error);
        return;
      }

      // Reload data after update
      await loadCreditData();
    } catch (error) {
      console.error('Error updating bonus credits:', error);
    }
  };

  useEffect(() => {
    loadCreditData();
  }, [email]);

  return {
    ...creditData,
    loadCreditData,
    updateBonusCreditsFromSocial,
  };
};
