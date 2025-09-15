import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Reply,
  Trash2,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_review' | 'resolved' | 'closed';
  user_id: string;
  user_email?: string;
  user_name?: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  admin_response?: string;
  attachments?: string[];
}

const FeedbackManagement = () => {
  const { user } = useAuth();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles!inner(
            email,
            display_name,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        user_email: item.profiles?.email,
        user_name: item.profiles?.display_name || item.profiles?.full_name || 'Anonymous'
      })) || [];

      setFeedbackItems(formattedData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string, notes?: string, response?: string) => {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (notes) updates.admin_notes = notes;
      if (response) updates.admin_response = response;

      const { error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Feedback updated successfully');
      fetchFeedback();
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Failed to update feedback');
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Feedback deleted successfully');
      fetchFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const exportFeedback = () => {
    const csv = [
      ['ID', 'Title', 'Category', 'Priority', 'Status', 'User', 'Email', 'Created', 'Description'].join(','),
      ...filteredFeedback.map(item => [
        item.id,
        `"${item.title}"`,
        item.category,
        item.priority,
        item.status,
        `"${item.user_name}"`,
        item.user_email,
        item.created_at,
        `"${item.description?.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredFeedback = feedbackItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug': return <Bug className="h-4 w-4 text-red-500" />;
      case 'feature': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'improvement': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: feedbackItems.length,
    new: feedbackItems.filter(item => item.status === 'new').length,
    inReview: feedbackItems.filter(item => item.status === 'in_review').length,
    resolved: feedbackItems.filter(item => item.status === 'resolved').length,
    bugs: feedbackItems.filter(item => item.category === 'bug').length,
    features: feedbackItems.filter(item => item.category === 'feature').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Feedback Management</h2>
          <p className="text-muted-foreground">
            Manage user feedback, bug reports, and feature requests
          </p>
        </div>
        <Button onClick={exportFeedback} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bug Reports</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bugs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Requests</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.features}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bug">Bug Reports</SelectItem>
                <SelectItem value="feature">Feature Requests</SelectItem>
                <SelectItem value="improvement">Improvements</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Items ({filteredFeedback.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No feedback found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {item.user_name}</span>
                        <span>Email: {item.user_email}</span>
                        <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFeedback(item);
                              setAdminResponse(item.admin_response || '');
                              setAdminNotes(item.admin_notes || '');
                            }}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manage Feedback</DialogTitle>
                            <DialogDescription>
                              Update status and respond to feedback
                            </DialogDescription>
                          </DialogHeader>

                          {selectedFeedback && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">{selectedFeedback.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedFeedback.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select
                                    value={selectedFeedback.status}
                                    onValueChange={(value) =>
                                      setSelectedFeedback(prev => prev ? {...prev, status: value as any} : null)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="in_review">In Review</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Priority</label>
                                  <Select
                                    value={selectedFeedback.priority}
                                    onValueChange={(value) =>
                                      setSelectedFeedback(prev => prev ? {...prev, priority: value as any} : null)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Admin Notes</label>
                                <Textarea
                                  placeholder="Internal notes (not visible to user)"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium">Response to User</label>
                                <Textarea
                                  placeholder="Response that will be sent to the user"
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                  className="mt-1"
                                />
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => {
                                    if (selectedFeedback) {
                                      updateFeedbackStatus(
                                        selectedFeedback.id,
                                        selectedFeedback.status,
                                        adminNotes,
                                        adminResponse
                                      );
                                    }
                                  }}
                                >
                                  Update Feedback
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFeedback(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackManagement;