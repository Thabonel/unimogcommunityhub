import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, RefreshCw, Rss, X, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RssFeed {
  id: string;
  name: string;
  description: string;
  feed_url: string;
  website_url: string;
  category: string;
  tags: string[];
  last_fetched_at: string | null;
  last_error: string | null;
  error_count: number;
  is_active: boolean;
  fetch_frequency_minutes: number;
}

interface FeedCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export function FeedManager() {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    feed_url: '',
    website_url: '',
    category: 'general',
  });

  useEffect(() => {
    loadFeeds();
    loadCategories();
  }, []);

  async function loadFeeds() {
    try {
      const { data, error } = await supabase
        .from('rss_feeds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeeds(data || []);
    } catch (error) {
      console.error('Error loading feeds:', error);
      toast({
        title: 'Error',
        description: 'Failed to load RSS feeds',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('feed_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function handleAddFeed() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('rss_feeds')
        .insert({
          ...formData,
          added_by: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'RSS feed added successfully',
      });

      setShowAddForm(false);
      setFormData({
        name: '',
        description: '',
        feed_url: '',
        website_url: '',
        category: 'general',
      });
      loadFeeds();
    } catch (error) {
      console.error('Error adding feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to add RSS feed',
        variant: 'destructive',
      });
    }
  }

  async function toggleFeedStatus(feedId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('rss_feeds')
        .update({ is_active: !currentStatus })
        .eq('id', feedId);

      if (error) throw error;
      loadFeeds();
    } catch (error) {
      console.error('Error toggling feed status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feed status',
        variant: 'destructive',
      });
    }
  }

  async function deleteFeed(feedId: string) {
    try {
      const { error } = await supabase
        .from('rss_feeds')
        .delete()
        .eq('id', feedId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Feed deleted successfully',
      });
      loadFeeds();
    } catch (error) {
      console.error('Error deleting feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feed',
        variant: 'destructive',
      });
    }
  }

  async function refreshAllFeeds() {
    setRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('fetch-rss-feeds');
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'RSS feeds refreshed successfully',
      });
      loadFeeds();
    } catch (error) {
      console.error('Error refreshing feeds:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh feeds',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RSS Feed Management</h2>
          <p className="text-muted-foreground">
            Manage RSS feeds for automatic content aggregation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshAllFeeds}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh All
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feed
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New RSS Feed</CardTitle>
            <CardDescription>
              Add a new RSS feed to automatically aggregate content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Feed Name</label>
                  <Input
                    placeholder="e.g., Expedition Portal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Feed URL</label>
                <Input
                  placeholder="https://example.com/feed.xml"
                  value={formData.feed_url}
                  onChange={(e) => setFormData({ ...formData, feed_url: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Website URL</label>
                <Input
                  placeholder="https://example.com"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of the feed content"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: '',
                      description: '',
                      feed_url: '',
                      website_url: '',
                      category: 'general',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddFeed}>Add Feed</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {feeds.map((feed) => (
          <Card key={feed.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Rss className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">{feed.name}</h3>
                    <Badge variant={feed.is_active ? 'default' : 'secondary'}>
                      {feed.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{feed.category}</Badge>
                  </div>
                  
                  {feed.description && (
                    <p className="text-sm text-muted-foreground">{feed.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>URL: {feed.feed_url}</span>
                    {feed.last_fetched_at && (
                      <span>
                        Last fetched: {formatDistanceToNow(new Date(feed.last_fetched_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  {feed.last_error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>Error: {feed.last_error}</span>
                      <span>(Failed {feed.error_count} times)</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeedStatus(feed.id, feed.is_active)}
                  >
                    {feed.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteFeed(feed.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}