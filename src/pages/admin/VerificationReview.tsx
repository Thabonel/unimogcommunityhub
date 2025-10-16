import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, Truck, User, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Verification {
  id: string;
  user_id: string;
  photo_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  vehicle_model: string;
  vehicle_year?: number;
  vehicle_location?: string;
  vehicle_story?: string;
  admin_reviewed_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_full_name?: string;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function VerificationReview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('');
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);

  useEffect(() => {
    loadVerifications();
    loadStats();
  }, [selectedTab]);

  async function loadStats() {
    const { data, error } = await supabase.rpc('get_verification_stats');

    if (error) {
      console.error('Error loading stats:', error);
      return;
    }

    if (data) {
      setStats(data);
    }
  }

  async function loadVerifications() {
    setLoading(true);

    let query = supabase
      .from('verifications')
      .select(`
        *,
        profiles!verifications_user_id_fkey(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (selectedTab !== 'all') {
      query = query.eq('status', selectedTab);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading verifications:', error);
      toast({
        title: 'Error loading verifications',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const formattedData = data?.map((v: any) => ({
      ...v,
      user_email: v.profiles?.email,
      user_full_name: v.profiles?.full_name,
    })) || [];

    setVerifications(formattedData);
    setLoading(false);
  }

  async function handleApprove(verification: Verification) {
    if (!user) return;

    const { error } = await supabase
      .from('verifications')
      .update({
        status: 'approved',
        admin_reviewed_by: user.id,
        approved_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq('id', verification.id);

    if (error) {
      toast({
        title: 'Error approving verification',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Verification approved',
      description: `${verification.user_full_name || verification.user_email} is now a verified owner`,
    });

    loadVerifications();
    loadStats();
  }

  function openRejectDialog(verification: Verification) {
    setSelectedVerification(verification);
    setRejectionCategory('');
    setRejectionReason('');
    setRejectDialogOpen(true);
  }

  async function handleReject() {
    if (!user || !selectedVerification) return;

    const finalReason = rejectionCategory === 'Other'
      ? rejectionReason
      : `${rejectionCategory}${rejectionReason ? `: ${rejectionReason}` : ''}`;

    const { error } = await supabase
      .from('verifications')
      .update({
        status: 'rejected',
        admin_reviewed_by: user.id,
        rejection_reason: finalReason,
        approved_at: null,
      })
      .eq('id', selectedVerification.id);

    if (error) {
      toast({
        title: 'Error rejecting verification',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Verification rejected',
      description: 'User will be notified and can resubmit',
    });

    setRejectDialogOpen(false);
    loadVerifications();
    loadStats();
  }

  async function handleBlockUser(verification: Verification) {
    if (!user) return;

    // First reject the verification
    await handleReject();

    // Then set user role to blocked (you'll need a user_roles table or use profiles)
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: verification.user_id,
        role: 'blocked',
      });

    if (error) {
      toast({
        title: 'Error blocking user',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'User blocked',
      description: 'User has been blocked from the platform',
      variant: 'destructive',
    });
  }

  function VerificationCard({ verification }: { verification: Verification }) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Photo */}
            <div>
              <img
                src={verification.photo_url}
                alt="Verification"
                className="w-full rounded-lg border cursor-pointer hover:opacity-90 transition"
                onClick={() => setFullSizeImage(verification.photo_url)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Uploaded {formatDistanceToNow(new Date(verification.created_at))} ago
              </p>
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{verification.user_full_name || 'Unknown User'}</h3>
                  <Badge variant={verification.status === 'approved' ? 'default' : verification.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {verification.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {verification.user_email}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <strong>Vehicle:</strong> {verification.vehicle_model}
                  {verification.vehicle_year && ` (${verification.vehicle_year})`}
                </p>

                {verification.vehicle_location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <strong>Location:</strong> {verification.vehicle_location}
                  </p>
                )}

                {verification.vehicle_story && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <strong className="text-xs uppercase text-muted-foreground">Owner's Story</strong>
                    <p className="mt-1 text-sm">{verification.vehicle_story}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {verification.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleApprove(verification)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => openRejectDialog(verification)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleBlockUser(verification)}
                    variant="outline"
                    size="icon"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {verification.status === 'approved' && verification.approved_at && (
                <p className="text-sm text-green-600 flex items-center gap-1 pt-4">
                  <CheckCircle className="h-4 w-4" />
                  Approved {formatDistanceToNow(new Date(verification.approved_at))} ago
                </p>
              )}

              {verification.status === 'rejected' && verification.rejection_reason && (
                <div className="pt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    <strong>Rejection reason:</strong> {verification.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6 space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading verifications...</p>
          ) : verifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No verifications in this category</p>
              </CardContent>
            </Card>
          ) : (
            verifications.map((verification) => (
              <VerificationCard key={verification.id} verification={verification} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Select a reason for rejecting this verification. The user will see this message and can resubmit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Rejection Reason</Label>
              <Select value={rejectionCategory} onValueChange={setRejectionCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Photo unclear">Photo unclear</SelectItem>
                  <SelectItem value="Not actual owner">Not actual owner</SelectItem>
                  <SelectItem value="Duplicate account">Duplicate account</SelectItem>
                  <SelectItem value="Missing username/date">Missing username/date in photo</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Details (optional)</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide more context for the user..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionCategory}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Size Image Dialog */}
      <Dialog open={!!fullSizeImage} onOpenChange={() => setFullSizeImage(null)}>
        <DialogContent className="max-w-4xl">
          <img src={fullSizeImage || ''} alt="Full size" className="w-full rounded-lg" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
