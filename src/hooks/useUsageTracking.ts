
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePricingTier } from './usePricingTier';

export const useUsageTracking = () => {
  const [usageCount, setUsageCount] = useState(0);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [bonusCredits, setBonusCredits] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyLimit, setMonthlyLimit] = useState(60);
  const [isBetaUser, setIsBetaUser] = useState(false);
  
  const { pricingData } = usePricingTier();

  const effectiveMonthlyLimit = pricingData?.foundersProgram?.is_available ? 60 : monthlyLimit;

  const loadUsageData = async () => {
    try {
      setLoading(true);
      
      // Check URL params for subscription status
      const urlParams = new URLSearchParams(window.location.search);
      const subscription = urlParams.get('subscription');
      
      if (subscription === 'success') {
        // Remove URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Clear old localStorage data for fresh start
        localStorage.removeItem('totalUsage');
        localStorage.removeItem('monthlyUsage');
        
        // Set as subscribed immediately
        setIsSubscribed(true);
        setUsageCount(0);
        setMonthlyUsage(0);
      }
      
      // Load stored email
      const storedEmail = localStorage.getItem('userEmail');
      setEmail(storedEmail);
      
      // Check if beta user
      if (storedEmail) {
        const betaEmails = ['demo@kodenyx.com'];
        setIsBetaUser(betaEmails.includes(storedEmail));
      }
      
      // Check subscription status if we have an email
      if (storedEmail && subscription !== 'success') {
        const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription', {
          body: { email: storedEmail }
        });
        
        if (!subError && subData) {
          setIsSubscribed(subData.subscribed || false);
          if (subData.subscribed) {
            // For subscribers, reset counters if this is first time checking after subscription
            const wasSubscribed = localStorage.getItem('wasSubscribed') === 'true';
            if (!wasSubscribed) {
              localStorage.setItem('totalUsage', '0');
              localStorage.setItem('monthlyUsage', '0');
              localStorage.setItem('wasSubscribed', 'true');
              setUsageCount(0);
              setMonthlyUsage(0);
            } else {
              // Load existing usage for returning subscribers
              const storedMonthly = parseInt(localStorage.getItem('monthlyUsage') || '0');
              setUsageCount(storedMonthly);
              setMonthlyUsage(storedMonthly);
            }
          } else {
            localStorage.setItem('wasSubscribed', 'false');
            // Load free user usage
            const storedUsage = parseInt(localStorage.getItem('totalUsage') || '0');
            const storedBonusCredits = parseInt(localStorage.getItem('bonusCredits') || '0');
            setUsageCount(storedUsage);
            setBonusCredits(storedBonusCredits);
          }
        }
      } else if (!storedEmail) {
        // No email stored - load free usage
        const storedUsage = parseInt(localStorage.getItem('totalUsage') || '0');
        const storedBonusCredits = parseInt(localStorage.getItem('bonusCredits') || '0');
        setUsageCount(storedUsage);
        setBonusCredits(storedBonusCredits);
      }
      
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsageData();
  }, []);

  const refreshUsageData = () => {
    loadUsageData();
  };

  const incrementUsage = async (userEmail?: string) => {
    if (isBetaUser) return; // Beta users have unlimited usage

    if (isSubscribed) {
      // Subscribed users: increment monthly usage
      const newMonthlyUsage = monthlyUsage + 1;
      setMonthlyUsage(newMonthlyUsage);
      setUsageCount(newMonthlyUsage);
      localStorage.setItem('monthlyUsage', newMonthlyUsage.toString());
    } else {
      // Free users: increment total usage
      const newUsage = usageCount + 1;
      setUsageCount(newUsage);
      localStorage.setItem('totalUsage', newUsage.toString());
    }
  };

  const setUserEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
    
    // Check if beta user
    const betaEmails = ['demo@kodenyx.com'];
    setIsBetaUser(betaEmails.includes(newEmail));
    
    // Refresh data to check subscription
    loadUsageData();
  };

  const createCheckoutSession = async (userEmail: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email: userEmail }
      });

      if (error) throw error;

      if (data?.url) {
        // Open in same window for better UX
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };

  // Determine access control
  const needsEmailCapture = !email && usageCount >= 1;
  const needsPaywall = email && !isSubscribed && usageCount >= (5 + bonusCredits);

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
