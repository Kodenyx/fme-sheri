
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsageData {
  total_usage: number;
  monthly_usage: number;
  bonus_credits: number;
  email: string;
  is_subscribed: boolean;
  monthly_limit: number;
  effective_monthly_limit: number;
}

export const useUsageTracking = () => {
  const [usageCount, setUsageCount] = useState(0);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [bonusCredits, setBonusCredits] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyLimit, setMonthlyLimit] = useState(60);
  const [effectiveMonthlyLimit, setEffectiveMonthlyLimit] = useState(60);

  // Check if user is beta user (client-side check for now)
  const isBetaUser = email?.startsWith('beta-user-') || localStorage.getItem('isBetaUser') === 'true';

  // Calculate limits and access control
  const effectiveFreeLimit = 5 + bonusCredits;
  const needsEmailCapture = !email && usageCount >= 2;
  const needsPaywall = email && !isSubscribed && usageCount >= effectiveFreeLimit;

  // Load initial data
  useEffect(() => {
    loadUsageData();
  }, []);

  // Check for subscription success in URL and refresh data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionStatus = urlParams.get('subscription');
      
      if (subscriptionStatus === 'success') {
        // Clear URL params and refresh data
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Refresh usage data to get updated subscription status
        setTimeout(() => {
          loadUsageData();
        }, 1000);
      }
    }
  }, []);

  const loadUsageData = async () => {
    try {
      console.log('Loading usage data...');
      const storedEmail = localStorage.getItem('userEmail');
      
      if (storedEmail) {
        setEmail(storedEmail);
        
        // Check subscription status
        const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription', {
          body: { email: storedEmail }
        });
        
        if (!subError && subData) {
          setIsSubscribed(subData.subscribed || false);
        }
      }

      // Load usage from localStorage for now
      const storedUsage = parseInt(localStorage.getItem('totalUsage') || '0');
      const storedMonthlyUsage = parseInt(localStorage.getItem('monthlyUsage') || '0');
      const storedBonusCredits = parseInt(localStorage.getItem('bonusCredits') || '0');
      
      setUsageCount(storedUsage);
      setMonthlyUsage(storedMonthlyUsage);
      setBonusCredits(storedBonusCredits);
      
      console.log('Usage data loaded:', { storedUsage, storedMonthlyUsage, storedBonusCredits, isSubscribed });
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsageData = useCallback(() => {
    loadUsageData();
  }, []);

  const incrementUsage = async (userEmail?: string) => {
    try {
      if (isBetaUser) {
        console.log('Beta user - usage not tracked');
        return;
      }

      const newTotalUsage = usageCount + 1;
      const newMonthlyUsage = monthlyUsage + 1;
      
      setUsageCount(newTotalUsage);
      setMonthlyUsage(newMonthlyUsage);
      
      // Store in localStorage
      localStorage.setItem('totalUsage', newTotalUsage.toString());
      localStorage.setItem('monthlyUsage', newMonthlyUsage.toString());
      
      console.log('Usage incremented:', { newTotalUsage, newMonthlyUsage });
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const setUserEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
  };

  const createCheckoutSession = async (userEmail: string) => {
    try {
      console.log('Creating checkout session for:', userEmail);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email: userEmail }
      });

      if (error) {
        console.error('Checkout creation error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        console.log('Redirecting to checkout:', data.url);
        // Open in the same window instead of a new tab for better UX
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error; // Re-throw to let the UI handle the error
    }
  };

  return {
    usageCount,
    monthlyUsage,
    bonusCredits,
    email,
    isSubscribed,
    needsEmailCapture,
    needsPaywall,
    loading,
    monthlyLimit,
    effectiveMonthlyLimit,
    isBetaUser,
    incrementUsage,
    setUserEmail,
    createCheckoutSession,
    refreshUsageData
  };
};
