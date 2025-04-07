
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { ManualHeader } from '@/components/knowledge/ManualHeader';
import { AdminManualView } from '@/components/knowledge/AdminManualView';
import { UserManualView } from '@/components/knowledge/UserManualView';
import { ManualSubmissionDialog } from '@/components/knowledge/ManualSubmissionDialog';
import { DeleteManualDialog } from '@/components/knowledge/DeleteManualDialog';
import { toast } from '@/hooks/use-toast';
import { useManuals } from '@/hooks/manuals';
import { ensureStorageBuckets, verifyBucket } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const KnowledgeManuals = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('approved');
  const [bucketsChecked, setBucketsChecked] = useState(false);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const {
    approvedManuals,
    pendingManuals,
    isLoading,
    viewingPdf,
    deleteDialogOpen,
    manualToDelete,
    setViewingPdf,
    setDeleteDialogOpen,
    setManualToDelete,
    handleApproveManual,
    handleRejectManual,
    handleDeleteManual,
    handleViewPdf,
    fetchManuals
  } = useManuals();
  
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L',
    isAdmin: true // In a real app, this would be determined by user roles
  };

  // Function to check buckets and initialize storage
  const checkAndInitializeBuckets = async () => {
    setIsVerifying(true);
    setBucketError(null);
    try {
      console.log('Checking and initializing buckets...');
      
      // First, check if the manuals bucket specifically exists
      const manualsBucketExists = await verifyBucket('manuals');
      
      if (!manualsBucketExists) {
        console.log('Manuals bucket verification failed, trying full bucket initialization...');
        // If direct verification fails, try the complete initialization
        await ensureStorageBuckets();
        
        // Check the manuals bucket again
        const retryResult = await verifyBucket('manuals');
        if (!retryResult) {
          setBucketError("Storage setup issue: Could not create or access the manuals bucket. Please try again or contact support.");
          setIsVerifying(false);
          return;
        }
      }
      
      // If we got here, the bucket exists
      console.log('Storage buckets verified, now fetching manuals...');
      setBucketsChecked(true);
      fetchManuals();
    } catch (error) {
      console.error("Error during bucket verification:", error);
      setBucketError("Could not verify storage buckets. Manuals may not load correctly.");
      toast({
        title: "Storage error",
        description: "Could not verify storage buckets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Ensure storage buckets exist when component mounts
  useEffect(() => {
    if (!bucketsChecked) {
      checkAndInitializeBuckets();
    }
  }, [bucketsChecked]);

  const handleManualSubmissionComplete = () => {
    setSubmissionDialogOpen(false);
    toast({
      title: "Manual submitted successfully",
      description: "Your manual has been added to the library",
    });
    fetchManuals(); // Refresh the list after submission
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <ManualHeader 
          openSubmissionDialog={() => setSubmissionDialogOpen(true)}
          adminCount={pendingManuals.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={mockUser.isAdmin}
        />
        
        {bucketError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Storage Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{bucketError}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={checkAndInitializeBuckets}
                disabled={isVerifying}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
                {isVerifying ? 'Checking...' : 'Retry'}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {isVerifying && !bucketError && (
          <Alert className="mb-6">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertTitle>Initializing storage...</AlertTitle>
            <AlertDescription>
              Setting up the manuals storage. This will only take a moment.
            </AlertDescription>
          </Alert>
        )}
        
        {mockUser.isAdmin ? (
          <AdminManualView 
            approvedManuals={approvedManuals}
            pendingManuals={pendingManuals}
            isLoading={isLoading || isVerifying}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onView={handleViewPdf}
            onDelete={(manual) => {
              setManualToDelete(manual);
              setDeleteDialogOpen(true);
            }}
            onSubmit={() => setSubmissionDialogOpen(true)}
            onApprove={handleApproveManual}
            onReject={handleRejectManual}
          />
        ) : (
          <UserManualView
            approvedManuals={approvedManuals}
            isLoading={isLoading || isVerifying}
            onView={handleViewPdf}
            onSubmit={() => setSubmissionDialogOpen(true)}
          />
        )}
        
        {/* PDF Viewer Component */}
        {viewingPdf && (
          <SimplePDFViewer url={viewingPdf} onClose={() => setViewingPdf(null)} />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteManualDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        manual={manualToDelete}
        onDelete={handleDeleteManual}
        onCancel={() => setManualToDelete(null)}
      />

      {/* Manual Submission Dialog */}
      <ManualSubmissionDialog
        open={submissionDialogOpen}
        onOpenChange={setSubmissionDialogOpen}
        onSubmitSuccess={handleManualSubmissionComplete}
      />
    </Layout>
  );
};

export default KnowledgeManuals;
