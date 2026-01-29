import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Note: Input, Label, Select, FileText available for future enhancements
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign, Users, TrendingUp, Eye, Check, X, Clock,
  Building, Heart, Shield, BarChart3, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';

interface MonetizationStats {
  verification_stats: {
    verified_users: number;
    pending_verifications: number;
    auto_approved: number;
  };
  vendor_stats: {
    active_vendors: number;
    pending_approval: number;
    monthly_vendor_revenue: number;
    premium_routes: number;
  };
  supporter_stats: {
    active_supporters: number;
    monthly_support_revenue: number;
    public_supporters: number;
  };
  revenue_stats: {
    total_mrr: number;
    this_month_revenue: number;
    last_30_days: number;
  };
  affiliate_stats: {
    total_products: number;
    total_clicks: number;
    featured_products: number;
  };
}

interface PendingVerification {
  id: string;
  user_id: string;
  users: {
    email: string;
  };
  vin_number: string;
  vehicle_model: string;
  vehicle_year: number;
  verification_type: string;
  confidence_score?: number;
  created_at: string;
  photo_url: string;
}

interface PendingVendor {
  id: string;
  business_name: string;
  contact_email: string;
  tier: string;
  monthly_fee: number;
  created_at: string;
  users: {
    email: string;
  };
}

export default function MonetizationDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [stats, setStats] = useState<MonetizationStats | null>(null);
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([]);
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load monetization stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_monetization_stats');
      if (statsError) throw statsError;
      setStats(statsData);

      // Load pending verifications
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('verifications')
        .select(`
          id,
          user_id,
          users!inner(email),
          vin_number,
          vehicle_model,
          vehicle_year,
          verification_type,
          confidence_score,
          created_at,
          photo_url
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (verificationsError) throw verificationsError;
      setPendingVerifications(verificationsData || []);

      // Load pending vendor applications
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('commercial_vendors')
        .select(`
          id,
          business_name,
          contact_email,
          tier,
          monthly_fee,
          created_at,
          users!inner(email)
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: true });

      if (vendorsError) throw vendorsError;
      setPendingVendors(vendorsData || []);

    } catch (error) {
      console.error('Error loading monetization data:', error);
      toast({
        title: "Error",
        description: "Failed to load monetization data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveVerification = async (verificationId: string) => {
    try {
      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          admin_reviewed_by: user?.id
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: "Verification Approved",
        description: "User has been verified as Unimog owner"
      });

      loadData(); // Refresh data
    } catch (error) {
      console.error('Error approving verification:', error);
      toast({
        title: "Error",
        description: "Failed to approve verification",
        variant: "destructive"
      });
    }
  };

  const rejectVerification = async (verificationId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          admin_reviewed_by: user?.id
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: "Verification Rejected",
        description: "User has been notified of the rejection"
      });

      loadData();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast({
        title: "Error",
        description: "Failed to reject verification",
        variant: "destructive"
      });
    }
  };

  const approveVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from('commercial_vendors')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', vendorId);

      if (error) throw error;

      toast({
        title: "Vendor Approved",
        description: "Vendor can now access commercial features"
      });

      loadData();
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monetization Dashboard</h1>
          <p className="text-gray-600">Manage revenue streams, verifications, and vendors</p>
        </div>
        <Button onClick={loadData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.revenue_stats.total_mrr.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.verification_stats.verified_users || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.verification_stats.pending_verifications || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.vendor_stats.active_vendors || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.vendor_stats.pending_approval || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supporters</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.supporter_stats.active_supporters || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats?.supporter_stats.monthly_support_revenue.toFixed(2) || '0.00'}/month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verifications">
            Verifications
            {pendingVerifications.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                {pendingVerifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="vendors">
            Vendors
            {pendingVendors.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                {pendingVendors.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>
                  Monthly recurring revenue by source
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Commercial Vendors</span>
                  <span className="font-medium">
                    ${stats?.vendor_stats.monthly_vendor_revenue.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Community Supporters</span>
                  <span className="font-medium">
                    ${stats?.supporter_stats.monthly_support_revenue.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total MRR</span>
                  <span>${stats?.revenue_stats.total_mrr.toFixed(2) || '0.00'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
                <CardDescription>
                  Items requiring admin attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingVerifications.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{pendingVerifications.length}</strong> verification(s) awaiting review
                    </AlertDescription>
                  </Alert>
                )}

                {pendingVendors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{pendingVendors.length}</strong> vendor application(s) pending approval
                    </AlertDescription>
                  </Alert>
                )}

                {pendingVerifications.length === 0 && pendingVendors.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    ✅ All caught up! No pending actions.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pending Verifications
              </CardTitle>
              <CardDescription>
                Review Unimog ownership verification requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending verifications to review
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVerifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{verification.users.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{verification.vehicle_model}</div>
                            {verification.vehicle_year && (
                              <div className="text-sm text-gray-500">{verification.vehicle_year}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-1 rounded">
                            {verification.vin_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {verification.verification_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {verification.confidence_score && (
                            <Badge
                              variant={verification.confidence_score >= 90 ? "default" : "secondary"}
                            >
                              {verification.confidence_score}%
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(verification.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveVerification(verification.id)}
                              className="bg-military-green hover:bg-military-green/90"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) {
                                  rejectVerification(verification.id, reason);
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(verification.photo_url, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Vendor Applications
              </CardTitle>
              <CardDescription>
                Review commercial vendor applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVendors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending vendor applications
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Monthly Fee</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vendor.business_name}</div>
                            <div className="text-sm text-gray-500">{vendor.contact_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.users.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vendor.tier === 'premium' ? 'default' :
                              vendor.tier === 'featured' ? 'secondary' : 'outline'
                            }
                          >
                            {vendor.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>${vendor.monthly_fee.toFixed(2)}</TableCell>
                        <TableCell>
                          {new Date(vendor.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveVendor(vendor.id)}
                              className="bg-military-green hover:bg-military-green/90"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supporters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Community Supporters
              </CardTitle>
              <CardDescription>
                Manage community supporter program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats?.supporter_stats.active_supporters || 0}</div>
                  <div className="text-sm text-gray-600">Active Supporters</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">${stats?.supporter_stats.monthly_support_revenue.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats?.supporter_stats.public_supporters || 0}</div>
                  <div className="text-sm text-gray-600">Public Recognition</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Analytics
              </CardTitle>
              <CardDescription>
                Financial performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Revenue Streams</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendors ({stats?.vendor_stats.active_vendors || 0})</span>
                      <span>${stats?.vendor_stats.monthly_vendor_revenue.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supporters ({stats?.supporter_stats.active_supporters || 0})</span>
                      <span>${stats?.supporter_stats.monthly_support_revenue.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Affiliate Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Products</span>
                      <span>{stats?.affiliate_stats.total_products || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Clicks</span>
                      <span>{stats?.affiliate_stats.total_clicks || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Featured</span>
                      <span>{stats?.affiliate_stats.featured_products || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}