import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnlimitedUsers = () => {
  const [unlimitedEmails, setUnlimitedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnlimitedUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('unlimited_users')
        .select('email')
        .eq('is_active', true);
      
      if (!error && data) {
        const emails = data.map(user => user.email);
        setUnlimitedEmails(emails);
        console.log('Fetched unlimited users:', emails);
        return emails;
      }
    } catch (error) {
      console.error('Error fetching unlimited users:', error);
    } finally {
      setLoading(false);
    }
    return [];
  };

  useEffect(() => {
    fetchUnlimitedUsers();
  }, []);

  const isUnlimitedUser = (email: string) => {
    return unlimitedEmails.includes(email);
  };

  const refreshUnlimitedUsers = () => {
    fetchUnlimitedUsers();
  };

  return {
    unlimitedEmails,
    loading,
    isUnlimitedUser,
    refreshUnlimitedUsers
  };
};