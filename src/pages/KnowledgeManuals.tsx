
import { useState } from 'react';
import Layout from '@/components/Layout';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { ManualHeader } from '@/components/knowledge/ManualHeader';
import { AdminManualView } from '@/components/knowledge/AdminManualView';
import { UserManualView } from '@/components/knowledge/UserManualView';
import { ManualSubmissionDialog } from '@/components/knowledge/ManualSubmissionDialog';
import { DeleteManualDialog } from '@/components/knowledge/DeleteManualDialog';
import { BucketVerificationAlerts } from '@/components/knowledge/BucketVerificationAlerts';
import { toast } from '@/hooks/use-toast';
import { useManuals } from '@/hooks/manuals';
import { useStorageInitialization } from '@/components/knowledge/useStorageInitialization';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const KnowledgeManuals = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('approved');

  // Storage initialization
  const {
    bucketError,
    isVerifying,
    verificationResult,
    checkAndInitializeBuckets
  } = useStorageInitialization();
  
  // Manual management
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
        
        <BucketVerificationAlerts
          bucketError={bucketError}
          isVerifying={isVerifying}
          verificationResult={verificationResult}
          onRetry={checkAndInitializeBuckets}
        />
        
        <ErrorBoundary>
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
        </ErrorBoundary>
        
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
