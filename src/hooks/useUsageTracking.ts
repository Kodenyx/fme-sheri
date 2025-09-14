import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePricingTier } from './usePricingTier';
import { useUnlimitedUsers } from './useUnlimitedUsers';

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
  const { isUnlimitedUser } = useUnlimitedUsers();

  const effectiveMonthlyLimit = pricingData?.foundersProgram?.is_available ? 60 : monthlyLimit;

  const loadUsageData = async () => {
    try {
      setLoading(true);
      console.log('Loading usage data...');
      
      // Check URL params for subscription status
      const urlParams = new URLSearchParams(window.location.search);
      const subscription = urlParams.get('subscription');
      
      if (subscription === 'success') {
        console.log('Subscription success detected, clearing URL params and resetting usage');
        // Remove URL params
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Clear old localStorage data for fresh start
        localStorage.removeItem('totalUsage');
        localStorage.removeItem('monthlyUsage');
        localStorage.setItem('wasSubscribed', 'true');
        
        // Set as subscribed immediately
        setIsSubscribed(true);
        setUsageCount(0);
        setMonthlyUsage(0);
        console.log('Reset usage counters for new subscription');
      }
      
      // Load stored email
      const storedEmail = localStorage.getItem('userEmail');
      setEmail(storedEmail);
      console.log('Stored email:', storedEmail);
      
      // Check if beta user or unlimited user and ensure proper email format
      if (storedEmail) {
        const isBeta = isUnlimitedUser(storedEmail);
        setIsBetaUser(isBeta);
        console.log('Beta user status:', isBeta);
      }
      
      // Check subscription status if we have an email
      if (storedEmail && subscription !== 'success') {
        console.log('Checking subscription status for:', storedEmail);
        const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription', {
          body: { email: storedEmail }
        });
        
        if (!subError && subData) {
          console.log('Subscription check result:', subData);
          const isCurrentlySubscribed = subData.subscribed || false;
          setIsSubscribed(isCurrentlySubscribed);
          
          if (isCurrentlySubscribed) {
            // For subscribers, reset counters if this is first time checking after subscription
            const wasSubscribed = localStorage.getItem('wasSubscribed') === 'true';
            if (!wasSubscribed) {
              console.log('First time subscriber detected, resetting usage');
              localStorage.setItem('totalUsage', '0');
              localStorage.setItem('monthlyUsage', '0');
              localStorage.setItem('wasSubscribed', 'true');
              setUsageCount(0);
              setMonthlyUsage(0);
            } else {
              // Load existing usage for returning subscribers
              const storedMonthly = parseInt(localStorage.getItem('monthlyUsage') || '0');
              console.log('Loading existing monthly usage for subscriber:', storedMonthly);
              setUsageCount(storedMonthly);
              setMonthlyUsage(storedMonthly);
            }
          } else {
            localStorage.setItem('wasSubscribed', 'false');
            // Load free user usage
            const storedUsage = parseInt(localStorage.getItem('totalUsage') || '0');
            const storedBonusCredits = parseInt(localStorage.getItem('bonusCredits') || '0');
            console.log('Loading free user usage:', storedUsage, 'bonus credits:', storedBonusCredits);
            setUsageCount(storedUsage);
            setBonusCredits(storedBonusCredits);
          }
        } else {
          console.error('Error checking subscription:', subError);
        }
      } else if (!storedEmail) {
        // No email stored - load free usage
        const storedUsage = parseInt(localStorage.getItem('totalUsage') || '0');
        const storedBonusCredits = parseInt(localStorage.getItem('bonusCredits') || '0');
        console.log('No email stored, loading free usage:', storedUsage, 'bonus credits:', storedBonusCredits);
        setUsageCount(storedUsage);
        setBonusCredits(storedBonusCredits);
      }
      
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
      console.log('Usage data loading complete');
    }
  };

  useEffect(() => {
    loadUsageData();
  }, []);

  const refreshUsageData = () => {
    console.log('Refreshing usage data...');
    loadUsageData();
  };

  const incrementUsage = async (userEmail?: string) => {
    console.log('Incrementing usage, current state:', { isBetaUser, isSubscribed, usageCount, monthlyUsage });
    
    if (isBetaUser) {
      console.log('Beta user - skipping usage increment');
      return; // Beta users have unlimited usage
    }

    if (isSubscribed) {
      // Subscribed users: increment monthly usage
      const newMonthlyUsage = monthlyUsage + 1;
      console.log('Incrementing monthly usage for subscriber:', newMonthlyUsage);
      setMonthlyUsage(newMonthlyUsage);
      setUsageCount(newMonthlyUsage);
      localStorage.setItem('monthlyUsage', newMonthlyUsage.toString());
    } else {
      // Free users: increment total usage
      const newUsage = usageCount + 1;
      console.log('Incrementing total usage for free user:', newUsage);
      setUsageCount(newUsage);
      localStorage.setItem('totalUsage', newUsage.toString());
    }
  };

  const setUserEmail = (newEmail: string) => {
    console.log('Setting user email:', newEmail);
    
    // Validate email format before setting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      console.error('Invalid email format:', newEmail);
      return;
    }
    
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
    
    // Check if beta user or unlimited user using the hook
    const isBeta = isUnlimitedUser(newEmail);
    setIsBetaUser(isBeta);
    console.log('Updated beta user status:', isBeta);
    
    // Refresh data to check subscription
    loadUsageData();
  };

  const createCheckoutSession = async (userEmail: string) => {
    try {
      console.log('Creating checkout session for:', userEmail);
      
      // Validate email format before sending to Stripe
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        throw new Error('Invalid email format. Please enter a valid email address.');
      }
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email: userEmail }
      });

      if (error) {
        console.error('Checkout session error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Checkout session created successfully');
        // Open in same window for better UX
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };

  // Determine access control
  const needsEmailCapture = !email && usageCount >= 1;
  const needsPaywall = email && !isSubscribed && usageCount >= (5 + bonusCredits);

  console.log('Current usage tracking state:', {
    usageCount,
    monthlyUsage,
    email,
    isSubscribed,
    isBetaUser,
    needsEmailCapture,
    needsPaywall,
    loading
  });

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