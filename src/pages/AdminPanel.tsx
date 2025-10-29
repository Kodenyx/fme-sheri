import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Lock, UserPlus, Calendar, Mail } from "lucide-react";

interface PromoAccess {
  id: string;
  email: string;
  duration_months: number;
  granted_at: string;
  expires_at: string;
  notes: string | null;
  is_active: boolean;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Promo access state
  const [email, setEmail] = useState("");
  const [duration, setDuration] = useState("1");
  const [notes, setNotes] = useState("");
  const [promoList, setPromoList] = useState<PromoAccess[]>([]);
  const [loadingPromo, setLoadingPromo] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-admin-password', {
        body: { password }
      });

      if (error) throw error;

      if (data.valid) {
        setIsAuthenticated(true);
        toast.success("Admin access granted");
        loadPromoAccess();
      } else {
        toast.error("Invalid password");
      }
    } catch (error) {
      console.error('Password validation error:', error);
      toast.error("Failed to validate password");
    } finally {
      setLoading(false);
    }
  };

  const loadPromoAccess = async () => {
    setLoadingPromo(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('manage-promotional-access', {
        body: { action: 'list' },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;
      setPromoList(data.data || []);
    } catch (error) {
      console.error('Error loading promotional access:', error);
      toast.error("Failed to load promotional access");
    } finally {
      setLoadingPromo(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPromo(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('manage-promotional-access', {
        body: {
          action: 'grant',
          email,
          duration: parseInt(duration),
          notes
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      toast.success(`Promotional access granted to ${email}`);
      setEmail("");
      setDuration("1");
      setNotes("");
      loadPromoAccess();
    } catch (error) {
      console.error('Error granting access:', error);
      toast.error("Failed to grant access");
    } finally {
      setLoadingPromo(false);
    }
  };

  const handleRevokeAccess = async (promoId: string) => {
    setLoadingPromo(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('manage-promotional-access', {
        body: {
          action: 'revoke',
          promoId
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      toast.success("Access revoked");
      loadPromoAccess();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error("Failed to revoke access");
    } finally {
      setLoadingPromo(false);
    }
  };

  const activePromos = promoList.filter(p => p.is_active && new Date(p.expires_at) > new Date());
  const expiredPromos = promoList.filter(p => !p.is_active || new Date(p.expires_at) <= new Date());

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">FixMyEmail Admin Panel</CardTitle>
            <CardDescription>Enter the admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Validating..." : "Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">FixMyEmail Admin</h1>
            <p className="text-muted-foreground">Manage promotional access and platform settings</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="promo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="promo">Promotional Access</TabsTrigger>
            {/* Future tabs can be added here */}
          </TabsList>

          <TabsContent value="promo" className="space-y-6">
            {/* Grant Access Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Grant Promotional Access
                </CardTitle>
                <CardDescription>
                  Provide free access to specific users for promotional purposes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGrantAccess} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Duration
                      </Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Month</SelectItem>
                          <SelectItem value="2">2 Months</SelectItem>
                          <SelectItem value="3">3 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Influencer promo, Partner deal..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={loadingPromo}>
                    {loadingPromo ? "Granting..." : "Grant Access"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Access */}
            <Card>
              <CardHeader>
                <CardTitle>Active Promotional Access ({activePromos.length})</CardTitle>
                <CardDescription>Currently active promotional access grants</CardDescription>
              </CardHeader>
              <CardContent>
                {activePromos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No active promotional access</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Granted</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activePromos.map((promo) => (
                          <TableRow key={promo.id}>
                            <TableCell className="font-medium">{promo.email}</TableCell>
                            <TableCell>{promo.duration_months} month{promo.duration_months > 1 ? 's' : ''}</TableCell>
                            <TableCell>{new Date(promo.granted_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(promo.expires_at).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{promo.notes || '-'}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevokeAccess(promo.id)}
                                disabled={loadingPromo}
                              >
                                Revoke
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expired Access */}
            {expiredPromos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Expired/Revoked Access ({expiredPromos.length})</CardTitle>
                  <CardDescription>Historical promotional access records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Granted</TableHead>
                          <TableHead>Expired</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expiredPromos.map((promo) => (
                          <TableRow key={promo.id}>
                            <TableCell className="font-medium">{promo.email}</TableCell>
                            <TableCell>{promo.duration_months} month{promo.duration_months > 1 ? 's' : ''}</TableCell>
                            <TableCell>{new Date(promo.granted_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(promo.expires_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className="text-muted-foreground">
                                {!promo.is_active ? 'Revoked' : 'Expired'}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{promo.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
