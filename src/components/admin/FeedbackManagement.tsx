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
  user_id: string;
  type: 'suggestion' | 'bug' | 'feature_request' | 'general';
  content: string;
  rating?: number;
  status: 'pending' | 'reviewing' | 'implemented' | 'declined';
  votes: number;
  created_at: string;
  metadata?: Record<string, any>;
  // Joined from profiles table
  email?: string;
  display_name?: string;
  full_name?: string;
  // Admin fields (could be added to metadata)
  admin_notes?: string;
  admin_response?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

const FeedbackManagement = () => {
  const { user } = useAuth();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
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
          profiles(
            email,
            display_name,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        email: item.profiles?.email,
        display_name: item.profiles?.display_name,
        full_name: item.profiles?.full_name,
        admin_notes: item.metadata?.admin_notes,
        admin_response: item.metadata?.admin_response,
        priority: item.metadata?.priority || 'medium'
      })) || [];

      setFeedbackItems(formattedData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string, notes?: string, response?: string, priority?: string) => {
    try {
      // Get current feedback to preserve existing metadata
      const { data: currentFeedback } = await supabase
        .from('feedback')
        .select('metadata')
        .eq('id', id)
        .single();

      const updatedMetadata = {
        ...(currentFeedback?.metadata || {}),
        ...(notes && { admin_notes: notes }),
        ...(response && { admin_response: response }),
        ...(priority && { priority }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('feedback')
        .update({
          status,
          metadata: updatedMetadata
        })
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
      ['ID', 'Type', 'Status', 'Priority', 'User', 'Email', 'Created', 'Rating', 'Votes', 'Content'].join(','),
      ...filteredFeedback.map(item => [
        item.id,
        item.type,
        item.status,
        item.priority || 'medium',
        `"${item.display_name || item.full_name || 'Anonymous'}"`,
        item.email || '',
        item.created_at,
        item.rating || '',
        item.votes || 0,
        `"${item.content?.replace(/"/g, '""')}"`
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
    const userName = item.display_name || item.full_name || 'Anonymous';
    const matchesSearch = searchQuery === '' ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'reviewing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'implemented': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <CheckCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-4 w-4 text-red-500" />;
      case 'feature_request': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'suggestion': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'general': return <MessageSquare className="h-4 w-4 text-gray-500" />;
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
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: feedbackItems.length,
    pending: feedbackItems.filter(item => item.status === 'pending').length,
    reviewing: feedbackItems.filter(item => item.status === 'reviewing').length,
    implemented: feedbackItems.filter(item => item.status === 'implemented').length,
    bugs: feedbackItems.filter(item => item.type === 'bug').length,
    features: feedbackItems.filter(item => item.type === 'feature_request').length,
    suggestions: feedbackItems.filter(item => item.type === 'suggestion').length
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
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.implemented}</div>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug Reports</SelectItem>
                <SelectItem value="feature_request">Feature Requests</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
                <SelectItem value="general">General</SelectItem>
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
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Ticket Header */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-xs font-mono text-muted-foreground">#{item.id.slice(0, 8)}</span>
                        </div>
                        <Badge className={getPriorityColor(item.priority || 'medium')}>
                          {item.priority || 'medium'}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </Badge>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < item.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 capitalize mb-1">
                          {item.type.replace('_', ' ')} Feedback
                        </h4>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {item.content}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👤 {item.display_name || item.full_name || 'Anonymous'}</span>
                        <span>✉️ {item.email || 'No email'}</span>
                        <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
                        <span>👍 {item.votes} votes</span>
                        {item.admin_response && <Badge variant="secondary" className="text-xs">Responded</Badge>}
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
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(selectedFeedback.type)}
                                  <h4 className="font-semibold capitalize">{selectedFeedback.type.replace('_', ' ')} Feedback</h4>
                                  <Badge className="text-xs">#{selectedFeedback.id.slice(0, 8)}</Badge>
                                </div>
                                <p className="text-sm text-gray-700">
                                  {selectedFeedback.content}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>From: {selectedFeedback.display_name || selectedFeedback.full_name || 'Anonymous'}</span>
                                  <span>Email: {selectedFeedback.email}</span>
                                  {selectedFeedback.rating && <span>Rating: {selectedFeedback.rating}/5 ⭐</span>}
                                  <span>Votes: {selectedFeedback.votes}</span>
                                </div>
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
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="reviewing">Reviewing</SelectItem>
                                      <SelectItem value="implemented">Implemented</SelectItem>
                                      <SelectItem value="declined">Declined</SelectItem>
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
                                        adminResponse,
                                        selectedFeedback.priority
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