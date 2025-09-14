import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnlimitedUsers = () => {
  const [unlimitedEmails, setUnlimitedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnlimitedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('unlimited_users')
        .select('email')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching unlimited users:', error);
        return;
      }

      const emails = data?.map(user => user.email) || [];
      setUnlimitedEmails(emails);
    } catch (error) {
      console.error('Error in fetchUnlimitedUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnlimitedUsers();
  }, []);

  return {
    unlimitedEmails,
    loading,
    refresh: fetchUnlimitedUsers
  };
};