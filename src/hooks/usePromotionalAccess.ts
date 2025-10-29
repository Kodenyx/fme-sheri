import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePromotionalAccess = (email: string | null) => {
  const [hasPromotionalAccess, setHasPromotionalAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPromotionalAccess = async () => {
      if (!email) {
        setHasPromotionalAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('promotional_access')
          .select('expires_at, is_active')
          .eq('email', email)
          .eq('is_active', true)
          .single();

        if (!error && data) {
          const expirationDate = new Date(data.expires_at);
          const now = new Date();
          
          if (expirationDate > now) {
            setHasPromotionalAccess(true);
            setExpiresAt(expirationDate);
          } else {
            setHasPromotionalAccess(false);
            setExpiresAt(null);
          }
        } else {
          setHasPromotionalAccess(false);
          setExpiresAt(null);
        }
      } catch (error) {
        console.error('Error checking promotional access:', error);
        setHasPromotionalAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkPromotionalAccess();
  }, [email]);

  return { hasPromotionalAccess, expiresAt, loading };
};
