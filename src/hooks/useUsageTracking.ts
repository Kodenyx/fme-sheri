
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UsageData {
  usageCount: number;
  monthlyUsage: number;
  email: string | null;
  isSubscribed: boolean;
  needsEmailCapture: boolean;
  needsPaywall: boolean;
  loading: boolean;
  monthlyLimit: number;
}

export const useUsageTracking = () => {
  const [usageData, setUsageData] = useState<UsageData>({
    usageCount: 0,
    monthlyUsage: 0,
    email: null,
    isSubscribed: false,
    needsEmailCapture: false,
    needsPaywall: false,
    loading: true,
    monthlyLimit: 60,
  });
  const { toast } = useToast();

  const getStoredEmail = (): string | null => {
    return localStorage.getItem('userEmail');
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

  const loadUsageData = async () => {
    setUsageData(prev => ({ ...prev, loading: true }));
    
    const storedEmail = getStoredEmail();
    const localCount = getLocalUsageCount();
    const monthlyCount = getMonthlyUsage();
    
    let actualCount = localCount;
    let isSubscribed = false;
    
    if (storedEmail) {
      const dbCount = await getUsageFromDatabase(storedEmail);
      actualCount = Math.max(localCount, dbCount);
      isSubscribed = await checkSubscription(storedEmail);
    }
    
    // Show email capture after 1st use when no email is stored
    const needsEmailCapture = actualCount >= 1 && !storedEmail;
    
    // Show paywall logic:
    // - For non-subscribers: after 5 uses
    // - For subscribers: after 60 uses in current month
    let needsPaywall = false;
    if (!isSubscribed) {
      needsPaywall = actualCount >= 5;
    } else {
      needsPaywall = monthlyCount >= 60;
    }
    
    console.log('Usage tracking debug:', {
      actualCount,
      monthlyCount,
      storedEmail,
      needsEmailCapture,
      needsPaywall,
      isSubscribed
    });
    
    setUsageData({
      usageCount: actualCount,
      monthlyUsage: monthlyCount,
      email: storedEmail,
      isSubscribed,
      needsEmailCapture,
      needsPaywall,
      loading: false,
      monthlyLimit: 60,
    });
  };

  const incrementUsage = async (email?: string) => {
    const currentEmail = email || getStoredEmail();
    const newCount = usageData.usageCount + 1;
    const newMonthlyCount = usageData.monthlyUsage + 1;
    
    setLocalUsageCount(newCount);
    setMonthlyUsage(newMonthlyCount);
    
    if (currentEmail) {
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
