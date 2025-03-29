
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualSubmissionForm } from '@/components/knowledge/ManualSubmissionForm';
import { PendingManualsList } from '@/components/knowledge/PendingManualsList';
import { toast } from '@/hooks/use-toast';
import { PdfViewer } from '@/components/knowledge/PdfViewer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ManualHeader } from '@/components/knowledge/ManualHeader';
import { ManualsList } from '@/components/knowledge/ManualsList';
import { useManuals } from '@/hooks/use-manuals';

const KnowledgeManuals = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('approved');
  
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
    handleDownload,
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
        
        {mockUser.isAdmin && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="approved">Available Manuals</TabsTrigger>
              <TabsTrigger value="pending">
                Pending Approval
                {pendingManuals.length > 0 && (
                  <span className="ml-2 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">
                    {pendingManuals.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="approved">
              <ManualsList
                manuals={approvedManuals}
                isLoading={isLoading}
                onView={handleViewPdf}
                onDownload={handleDownload}
                onDelete={(manual) => {
                  setManualToDelete(manual);
                  setDeleteDialogOpen(true);
                }}
                onSubmit={() => setSubmissionDialogOpen(true)}
                isAdmin={mockUser.isAdmin}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="mt-4">
                <h2 className="text-lg font-medium mb-4">Manuals Pending Approval</h2>
                <PendingManualsList 
                  pendingManuals={pendingManuals}
                  onApprove={handleApproveManual}
                  onReject={handleRejectManual}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {!mockUser.isAdmin && (
          <ManualsList
            manuals={approvedManuals}
            isLoading={isLoading}
            onView={handleViewPdf}
            onDownload={handleDownload}
            onSubmit={() => setSubmissionDialogOpen(true)}
            isAdmin={false}
          />
        )}
        
        {/* PDF Viewer Component */}
        {viewingPdf && (
          <PdfViewer url={viewingPdf} onClose={() => setViewingPdf(null)} />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{manualToDelete?.metadata?.title || manualToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setManualToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteManual} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manual Submission Dialog */}
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Submit a Manual</DialogTitle>
            <DialogDescription>
              Share your Unimog manual with the community. All submissions will be reviewed before publishing.
            </DialogDescription>
          </DialogHeader>
          <ManualSubmissionForm onSubmitSuccess={handleManualSubmissionComplete} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default KnowledgeManuals;
