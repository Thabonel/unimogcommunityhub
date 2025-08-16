import { supabase } from '@/lib/supabase-client';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Category = 'UI/Design' | 'Functionality' | 'Content' | 'Performance' | 'Integration' | 'Other';
export type Status = 'Open' | 'Closed';

export interface QAIssue {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  priority: Priority;
  category: Category;
  status: Status;
  notes: string | null;
  screenshot_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  closed_by: string | null;
  // Virtual fields for display
  creator?: {
    email: string;
    full_name: string | null;
  };
  closer?: {
    email: string;
    full_name: string | null;
  };
}

export interface CreateQAIssueInput {
  title: string;
  description?: string;
  url?: string;
  priority: Priority;
  category: Category;
  status?: Status;
  notes?: string;
  screenshot_url?: string;
}

export interface UpdateQAIssueInput {
  title?: string;
  description?: string;
  url?: string;
  priority?: Priority;
  category?: Category;
  status?: Status;
  notes?: string;
  screenshot_url?: string;
}

class QAIssuesService {
  /**
   * Fetch all QA issues with optional filters
   */
  async getIssues(filters?: {
    status?: Status;
    priority?: Priority;
    category?: Category;
    search?: string;
  }) {
    let query = supabase
      .from('qa_issues')
      .select(`
        *,
        creator:profiles!qa_issues_created_by_fkey(email, full_name),
        closer:profiles!qa_issues_closed_by_fkey(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching QA issues:', error);
      throw error;
    }

    return data as QAIssue[];
  }

  /**
   * Get a single QA issue by ID
   */
  async getIssue(id: string) {
    const { data, error } = await supabase
      .from('qa_issues')
      .select(`
        *,
        creator:profiles!qa_issues_created_by_fkey(email, full_name),
        closer:profiles!qa_issues_closed_by_fkey(email, full_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching QA issue:', error);
      throw error;
    }

    return data as QAIssue;
  }

  /**
   * Create a new QA issue
   */
  async createIssue(input: CreateQAIssueInput) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('qa_issues')
      .insert({
        ...input,
        created_by: userData?.user?.id,
        status: input.status || 'Open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating QA issue:', error);
      throw error;
    }

    return data as QAIssue;
  }

  /**
   * Update an existing QA issue
   */
  async updateIssue(id: string, input: UpdateQAIssueInput) {
    const { data, error } = await supabase
      .from('qa_issues')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating QA issue:', error);
      throw error;
    }

    return data as QAIssue;
  }

  /**
   * Delete a QA issue
   */
  async deleteIssue(id: string) {
    const { error } = await supabase
      .from('qa_issues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting QA issue:', error);
      throw error;
    }

    return true;
  }

  /**
   * Toggle issue status between Open and Closed
   */
  async toggleStatus(id: string) {
    const issue = await this.getIssue(id);
    const newStatus = issue.status === 'Open' ? 'Closed' : 'Open';
    
    return this.updateIssue(id, { status: newStatus });
  }

  /**
   * Upload a screenshot for a QA issue
   */
  async uploadScreenshot(file: File, issueId?: string): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User not authenticated');

    const fileName = `${userData.user.id}/${issueId || 'temp'}-${Date.now()}.${file.name.split('.').pop()}`;
    
    const { data, error } = await supabase.storage
      .from('qa-screenshots')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading screenshot:', error);
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('qa-screenshots')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  /**
   * Delete a screenshot
   */
  async deleteScreenshot(url: string) {
    // Extract the path from the URL
    const urlParts = url.split('/qa-screenshots/');
    if (urlParts.length !== 2) return;
    
    const path = urlParts[1];
    
    const { error } = await supabase.storage
      .from('qa-screenshots')
      .remove([path]);

    if (error) {
      console.error('Error deleting screenshot:', error);
      throw error;
    }

    return true;
  }

  /**
   * Subscribe to real-time updates for QA issues
   */
  subscribeToIssues(callback: (payload: any) => void) {
    return supabase
      .channel('qa_issues_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'qa_issues' },
        callback
      )
      .subscribe();
  }

  /**
   * Export issues to CSV
   */
  exportToCSV(issues: QAIssue[]) {
    const headers = [
      'ID',
      'Title',
      'Description',
      'URL',
      'Priority',
      'Category',
      'Status',
      'Created At',
      'Updated At',
      'Created By',
      'Notes'
    ];

    const rows = issues.map(issue => [
      issue.id,
      issue.title,
      issue.description || '',
      issue.url || '',
      issue.priority,
      issue.category,
      issue.status,
      new Date(issue.created_at).toLocaleString(),
      new Date(issue.updated_at).toLocaleString(),
      issue.creator?.email || '',
      issue.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => 
          `"${String(cell).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa_issues_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export issues to JSON
   */
  exportToJSON(issues: QAIssue[]) {
    const blob = new Blob([JSON.stringify(issues, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa_issues_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const qaIssuesService = new QAIssuesService();