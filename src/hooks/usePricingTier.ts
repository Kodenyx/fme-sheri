
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PricingTier {
  id: string;
  name: string;
  price_cents: number;
  price_display: string;
  seats_available: boolean;
  current_seats: number;
  max_seats: number;
}

export interface PricingData {
  currentTier: PricingTier;
  foundersProgram: {
    seats_remaining: number;
    is_available: boolean;
  };
}

export const usePricingTier = () => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPricingTier = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('get-pricing-tier');

      if (error) throw error;

      setPricingData(data);
    } catch (err) {
      console.error('Error fetching pricing tier:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingTier();
  }, []);

  return {
    pricingData,
    loading,
    error,
    refetch: fetchPricingTier
  };
};
