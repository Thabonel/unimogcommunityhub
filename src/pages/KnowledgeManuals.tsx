
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { ManualHeader } from '@/components/knowledge/ManualHeader';
import { AdminManualView } from '@/components/knowledge/AdminManualView';
import { UserManualView } from '@/components/knowledge/UserManualView';
import { ManualSubmissionDialog } from '@/components/knowledge/ManualSubmissionDialog';
import { DeleteManualDialog } from '@/components/knowledge/DeleteManualDialog';
import { BucketVerificationAlerts } from '@/components/knowledge/BucketVerificationAlerts';
import { TVModeContainer } from '@/components/knowledge/TVModeContainer';
import { toast } from '@/hooks/use-toast';
import { useManuals } from '@/hooks/manuals';
import { useStorageInitialization } from '@/components/knowledge/useStorageInitialization';
import { ErrorBoundary } from '@/components/error-boundary';
import { supabase } from '@/lib/supabase-client';
import { checkIsAdmin } from '@/utils/adminUtils';

const KnowledgeManuals = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('approved');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tvModeOpen, setTvModeOpen] = useState(false);

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
    error,
    setViewingPdf,
    setDeleteDialogOpen,
    setManualToDelete,
    handleApproveManual,
    handleRejectManual,
    handleDeleteManual,
    handleViewPdf,
    fetchManuals
  } = useManuals();
  
  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            name: authUser.email?.split('@')[0] || 'User',
            avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
            unimogModel: 'U1700L',
            email: authUser.email
          });
          
          // Check if user is admin
          const adminStatus = await checkIsAdmin(authUser.id);
          setIsAdmin(adminStatus);
          console.log('User admin status:', adminStatus);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleManualSubmissionComplete = () => {
    setSubmissionDialogOpen(false);
    toast({
      title: "Manual submitted successfully",
      description: "Your manual has been added to the library",
    });
    fetchManuals(); // Refresh the list after submission
  };
  
  if (checkingAuth) {
    return (
      <Layout isLoggedIn={false}>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={!!user} user={user}>
      <div className="container py-8">
        <ManualHeader
          openSubmissionDialog={() => setSubmissionDialogOpen(true)}
          adminCount={pendingManuals.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
          onTVModeClick={() => setTvModeOpen(true)}
        />
        
        {/* Military Documentation Explanation */}
        <div className="bg-military-green/10 border border-military-green/30 rounded-lg p-3 mb-4">
          <h2 className="font-semibold text-base mb-1 text-military-green">Ex-Military Documentation Library</h2>
          <p className="text-xs text-mud-black/70">
            Official ADF technical manuals for Mercedes-Benz Unimogs (1986-2000s).
            Includes operator guides, maintenance schedules, technical specs, and field repair procedures.
          </p>
        </div>
        
        <BucketVerificationAlerts
          bucketError={bucketError}
          isVerifying={isVerifying}
          verificationResult={verificationResult}
          onRetry={checkAndInitializeBuckets}
        />
        
        <ErrorBoundary>
          {isAdmin ? (
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
              error={error}
            />
          ) : (
            <UserManualView
              approvedManuals={approvedManuals}
              isLoading={isLoading || isVerifying}
              onView={handleViewPdf}
              onSubmit={() => setSubmissionDialogOpen(true)}
              error={error}
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

      {/* TV Mode Interface */}
      <TVModeContainer
        user={user}
        isOpen={tvModeOpen}
        onClose={() => setTvModeOpen(false)}
      />
    </Layout>
  );
};

export default KnowledgeManuals;
