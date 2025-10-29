import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, UserPlus, Trash2 } from 'lucide-react';

interface PromotionalGrant {
  id: string;
  email: string;
  duration_months: number;
  granted_at: string;
  expires_at: string;
  notes: string | null;
  is_active: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [grants, setGrants] = useState<PromotionalGrant[]>([]);
  const [loadingGrants, setLoadingGrants] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    duration: '1',
    notes: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && !authLoading) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isAdmin, adminLoading, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadGrants();
    }
  }, [isAdmin]);

  const loadGrants = async () => {
    try {
      setLoadingGrants(true);
      const { data, error } = await supabase
        .from('promotional_access')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGrants(data || []);
    } catch (error) {
      console.error('Error loading grants:', error);
      toast.error('Failed to load promotional grants');
    } finally {
      setLoadingGrants(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const durationMonths = parseInt(formData.duration);
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

      const { error } = await supabase
        .from('promotional_access')
        .insert({
          email: formData.email.toLowerCase().trim(),
          duration_months: durationMonths,
          expires_at: expiresAt.toISOString(),
          granted_by: user?.id,
          notes: formData.notes || null,
          is_active: true
        });

      if (error) throw error;

      toast.success(`Granted ${durationMonths} month${durationMonths > 1 ? 's' : ''} of free access to ${formData.email}`);
      setFormData({ email: '', duration: '1', notes: '' });
      loadGrants();
    } catch (error: any) {
      console.error('Error granting access:', error);
      if (error.code === '23505') {
        toast.error('This email already has promotional access');
      } else {
        toast.error('Failed to grant access');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeAccess = async (id: string, email: string) => {
    try {
      const { error } = await supabase
        .from('promotional_access')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Revoked access for ${email}`);
      loadGrants();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error('Failed to revoke access');
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage promotional free access for leads and clients</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Grant Promotional Access
            </CardTitle>
            <CardDescription>
              Give free access to potential leads for promotional purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Access Duration *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., VIP client, special promotion, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Granting Access...
                  </>
                ) : (
                  'Grant Free Access'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Promotional Grants</CardTitle>
            <CardDescription>
              {grants.filter(g => g.is_active).length} active grant(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingGrants ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : grants.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No promotional grants yet</p>
            ) : (
              <div className="space-y-4">
                {grants.map((grant) => {
                  const expiresAt = new Date(grant.expires_at);
                  const isExpired = expiresAt < new Date();
                  
                  return (
                    <div
                      key={grant.id}
                      className={`p-4 border rounded-lg ${
                        !grant.is_active || isExpired ? 'opacity-50 bg-muted' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{grant.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {grant.duration_months} month{grant.duration_months > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires: {expiresAt.toLocaleDateString()}
                            {isExpired && ' (Expired)'}
                          </p>
                          {grant.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              Note: {grant.notes}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Status: {grant.is_active ? 'Active' : 'Revoked'}
                          </p>
                        </div>
                        {grant.is_active && !isExpired && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeAccess(grant.id, grant.email)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
