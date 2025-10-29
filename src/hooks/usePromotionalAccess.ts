import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePromotionalAccess = (email: string | null) => {
  const [hasPromotionalAccess, setHasPromotionalAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const checkPromotionalAccess = async () => {
      if (!email) {
        if (mounted) {
          setHasPromotionalAccess(false);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('promotional_access')
          .select('expires_at, is_active')
          .eq('email', email)
          .eq('is_active', true)
          .maybeSingle();

        if (!mounted) return;

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
        if (mounted) {
          setHasPromotionalAccess(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkPromotionalAccess();
    
    return () => {
      mounted = false;
    };
  }, [email]);

  return { hasPromotionalAccess, expiresAt, loading };
};
