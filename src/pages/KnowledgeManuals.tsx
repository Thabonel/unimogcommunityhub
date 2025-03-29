
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowLeft, Upload, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualSubmissionForm } from '@/components/knowledge/ManualSubmissionForm';
import { PendingManualsList, PendingManual } from '@/components/knowledge/PendingManualsList';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Manual = Tables<'manuals'> & {
  submitter_name?: string;
};

const KnowledgeManuals = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [pendingManuals, setPendingManuals] = useState<PendingManual[]>([]);
  const [approvedManuals, setApprovedManuals] = useState<Manual[]>([]);
  const [activeTab, setActiveTab] = useState('approved');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L',
    isAdmin: true // In a real app, this would be determined by user roles
  };

  // Fetch manuals from Supabase
  useEffect(() => {
    const fetchManuals = async () => {
      setIsLoading(true);
      
      try {
        // Fetch approved manuals
        const { data: approvedData, error: approvedError } = await supabase
          .from('manuals')
          .select('*')
          .eq('approved', true);

        if (approvedError) {
          throw approvedError;
        }

        setApprovedManuals(approvedData || []);
        
        // Fetch pending manuals
        const { data: pendingData, error: pendingError } = await supabase
          .from('manuals')
          .select('*')
          .eq('approved', false);

        if (pendingError) {
          throw pendingError;
        }
        
        // Convert to PendingManual format
        const formattedPendingManuals = pendingData.map(manual => ({
          id: manual.id,
          title: manual.title,
          description: manual.description,
          fileName: manual.file_path.split('/').pop() || 'Unknown file',
          submittedBy: manual.submitted_by,
          submittedAt: new Date(manual.created_at).toLocaleDateString(),
        }));
        
        setPendingManuals(formattedPendingManuals);
      } catch (error) {
        console.error('Error fetching manuals:', error);
        toast({
          title: 'Failed to load manuals',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchManuals();
  }, []);
  
  const handleManualSubmissionComplete = () => {
    setSubmissionDialogOpen(false);
    toast({
      title: "Manual submitted successfully",
      description: "Your manual is now pending admin approval",
    });
  };

  const handleApproveManual = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manuals')
        .update({ approved: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPendingManuals(prev => prev.filter(manual => manual.id !== id));
      
      // Refresh approved manuals
      const { data, error: fetchError } = await supabase
        .from('manuals')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      setApprovedManuals(prev => [...prev, data]);
      
      toast({
        title: "Manual approved",
        description: "The manual is now visible to all users",
      });
    } catch (error) {
      console.error('Error approving manual:', error);
      toast({
        title: 'Failed to approve manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleRejectManual = async (id: string) => {
    try {
      // In a real application, you might want to move this to a deletion queue
      // or add a 'rejected' status instead of deleting immediately
      const { error } = await supabase
        .from('manuals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPendingManuals(prev => prev.filter(manual => manual.id !== id));
      
      toast({
        title: "Manual rejected",
        description: "The manual has been rejected",
      });
    } catch (error) {
      console.error('Error rejecting manual:', error);
      toast({
        title: 'Failed to reject manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDownload = async (filePath: string, title: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('manuals')
        .download(filePath);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = title + '.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading manual:', error);
      toast({
        title: 'Failed to download manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/knowledge">Knowledge Base</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Vehicle Manuals</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Button variant="outline" className="mb-4" asChild>
              <Link to="/knowledge">
                <ArrowLeft size={16} className="mr-2" />
                Back to Knowledge Base
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Vehicle Manuals
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Access official Unimog technical documentation, owner's manuals, and service guides.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload size={16} />
                  Submit Manual
                </Button>
              </DialogTrigger>
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

            {mockUser.isAdmin && pendingManuals.length > 0 && (
              <Button 
                onClick={() => setActiveTab('pending')} 
                variant={activeTab === 'pending' ? 'default' : 'outline'} 
                className="gap-2"
              >
                <ShieldCheck size={16} />
                <span>Admin Review</span>
                <span className="bg-primary-foreground text-primary ml-1 px-1.5 py-0.5 rounded-full text-xs">
                  {pendingManuals.length}
                </span>
              </Button>
            )}
          </div>
        </div>
        
        {mockUser.isAdmin && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="approved">Approved Manuals</TabsTrigger>
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
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading manuals...</p>
                </div>
              ) : approvedManuals.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
                  <FileText size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No manuals available yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to contribute a manual to the Unimog community.</p>
                  <Button onClick={() => setSubmissionDialogOpen(true)} className="gap-2">
                    <Upload size={16} />
                    Submit a Manual
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {approvedManuals.map((manual) => (
                    <Card key={manual.id} className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{manual.title}</CardTitle>
                        <CardDescription>{manual.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <div className="aspect-[3/4] bg-muted rounded-md mb-4 flex items-center justify-center">
                          <FileText size={64} className="text-muted-foreground opacity-40" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Pages</p>
                            <p className="font-medium">{manual.pages || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Size</p>
                            <p className="font-medium">{formatFileSize(manual.file_size)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Last Updated</p>
                            <p className="font-medium">{new Date(manual.updated_at || manual.created_at || '').toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button 
                          className="mt-auto w-full gap-2"
                          onClick={() => handleDownload(manual.file_path, manual.title)}
                        >
                          <Download size={16} />
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
          isLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading manuals...</p>
            </div>
          ) : approvedManuals.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
              <FileText size={48} className="mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No manuals available yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to contribute a manual to the Unimog community.</p>
              <Button onClick={() => setSubmissionDialogOpen(true)} className="gap-2">
                <Upload size={16} />
                Submit a Manual
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {approvedManuals.map((manual) => (
                <Card key={manual.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{manual.title}</CardTitle>
                    <CardDescription>{manual.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="aspect-[3/4] bg-muted rounded-md mb-4 flex items-center justify-center">
                      <FileText size={64} className="text-muted-foreground opacity-40" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Pages</p>
                        <p className="font-medium">{manual.pages || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{formatFileSize(manual.file_size)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{new Date(manual.updated_at || manual.created_at || '').toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button 
                      className="mt-auto w-full gap-2"
                      onClick={() => handleDownload(manual.file_path, manual.title)}
                    >
                      <Download size={16} />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default KnowledgeManuals;
