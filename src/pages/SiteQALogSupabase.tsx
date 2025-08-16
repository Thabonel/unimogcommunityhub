import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { qaIssuesService, type QAIssue, type Priority, type Category, type Status } from '@/services/qaIssues';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Upload, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { groupedPages } from '@/config/sitePages';

const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const categories: Category[] = ['UI/Design', 'Functionality', 'Content', 'Performance', 'Integration', 'Other'];
const statuses: Status[] = ['Open', 'Closed'];

function clsx(...cn: (string | false | null | undefined)[]) {
  return cn.filter(Boolean).join(' ');
}

function Badge({ children, variant }: { children: React.ReactNode; variant: Priority | Status }) {
  const color =
    variant === 'Critical'
      ? 'bg-red-100 text-red-800 ring-red-200'
      : variant === 'High'
      ? 'bg-orange-100 text-orange-800 ring-orange-200'
      : variant === 'Medium'
      ? 'bg-yellow-100 text-yellow-800 ring-yellow-200'
      : variant === 'Low'
      ? 'bg-green-100 text-green-800 ring-green-200'
      : variant === 'Open'
      ? 'bg-blue-100 text-blue-800 ring-blue-200'
      : 'bg-zinc-100 text-zinc-800 ring-zinc-200';
  return (
    <span className={clsx('inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ring-1', color)}>
      {children}
    </span>
  );
}

export default function SiteQALogSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [issues, setIssues] = useState<QAIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter states
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'category' | 'status'>('priority');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [urlMode, setUrlMode] = useState<'dropdown' | 'custom'>('dropdown');
  const [customUrl, setCustomUrl] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [category, setCategory] = useState<Category>('Functionality');
  const [status, setStatus] = useState<Status>('Open');
  const [notes, setNotes] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load issues on mount and set up real-time subscription
  useEffect(() => {
    loadIssues();
    
    // Set up real-time subscription
    const subscription = qaIssuesService.subscribeToIssues((payload) => {
      console.log('Real-time update:', payload);
      loadIssues(); // Reload issues on any change
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload issues when filters change
  useEffect(() => {
    if (!loading) { // Only reload if not already loading
      loadIssues();
    }
  }, [filterStatus, filterPriority, filterCategory, query, sortBy, sortDir]); // eslint-disable-line react-hooks/exhaustive-deps

  // No longer auto-prefill URL since we use dropdown

  async function loadIssues() {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterStatus !== 'All') filters.status = filterStatus;
      if (filterPriority !== 'All') filters.priority = filterPriority;
      if (filterCategory !== 'All') filters.category = filterCategory;
      if (query) filters.search = query;
      
      const data = await qaIssuesService.getIssues(filters);
      
      // Sort the issues
      const sorted = [...data].sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
          return sortDir === 'asc' ? diff : -diff;
        }
        if (sortBy === 'date') {
          const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          return sortDir === 'asc' ? diff : -diff;
        }
        if (sortBy === 'category') {
          const diff = a.category.localeCompare(b.category);
          return sortDir === 'asc' ? diff : -diff;
        }
        if (sortBy === 'status') {
          const diff = a.status.localeCompare(b.status);
          return sortDir === 'asc' ? diff : -diff;
        }
        return 0;
      });
      
      setIssues(sorted);
    } catch (error) {
      console.error('Error loading issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load QA issues',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    // Keep the selected page for the next issue
    // Don't reset selectedPage or urlMode
    if (urlMode === 'custom') {
      setCustomUrl('');
    }
    setPriority('High');
    setCategory('Functionality');
    setStatus('Open');
    setNotes('');
    setScreenshotFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    
    setSubmitting(true);
    try {
      let screenshot_url: string | undefined;
      
      // Upload screenshot if provided
      if (screenshotFile) {
        screenshot_url = await qaIssuesService.uploadScreenshot(screenshotFile);
      }
      
      // Determine the URL based on mode
      const finalUrl = urlMode === 'dropdown' 
        ? (selectedPage === 'custom' ? customUrl : `${window.location.origin}${selectedPage}`)
        : customUrl;
      
      // Create the issue
      await qaIssuesService.createIssue({
        title: title.trim(),
        description: description.trim() || undefined,
        url: finalUrl.trim() || undefined,
        priority,
        category,
        status,
        notes: notes.trim() || undefined,
        screenshot_url
      });
      
      toast({
        title: 'Success',
        description: 'QA issue created successfully'
      });
      
      resetForm();
      await loadIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to create QA issue',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(id: string) {
    try {
      await qaIssuesService.toggleStatus(id);
      await loadIssues();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update issue status',
        variant: 'destructive'
      });
    }
  }

  async function updateNotes(id: string, newNotes: string) {
    try {
      await qaIssuesService.updateIssue(id, { notes: newNotes });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive'
      });
    }
  }

  async function deleteIssue(id: string) {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    try {
      await qaIssuesService.deleteIssue(id);
      await loadIssues();
      toast({
        title: 'Success',
        description: 'Issue deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete issue',
        variant: 'destructive'
      });
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-zinc-600 mb-6">Please log in to access the QA tracking system</p>
          <Link to="/login" className="rounded-lg bg-black text-white px-6 py-2 hover:opacity-90">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Website QA & Fix Log</h1>
              <p className="text-sm text-zinc-600">
                Collaborative issue tracking • Real-time sync • {issues.length} issues
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => qaIssuesService.exportToCSV(issues)} 
                className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button 
                onClick={() => qaIssuesService.exportToJSON(issues)} 
                className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Backup JSON
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleSubmit} className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
            <input
              className="lg:col-span-3 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting}
            />
            {urlMode === 'dropdown' ? (
              <select
                className="lg:col-span-3 w-full rounded-lg border px-3 py-2 text-sm"
                value={selectedPage}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'custom') {
                    setUrlMode('custom');
                    setSelectedPage('custom');
                  } else {
                    setSelectedPage(value);
                  }
                }}
                disabled={submitting}
              >
                <option value="custom">Custom URL...</option>
                {Object.entries(groupedPages).map(([category, pages]) => (
                  <optgroup key={category} label={category}>
                    {pages.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <div className="lg:col-span-3 flex gap-2">
                <input
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  placeholder="Enter custom URL..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => {
                    setUrlMode('dropdown');
                    setSelectedPage('/');
                    setCustomUrl('');
                  }}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
                  disabled={submitting}
                >
                  Back
                </button>
              </div>
            )}
            <select
              className="lg:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              disabled={submitting}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  Priority: {p}
                </option>
              ))}
            </select>
            <select
              className="lg:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              disabled={submitting}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
            <select
              className="lg:col-span-2 w-full rounded-lg border px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              disabled={submitting}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
            <textarea
              className="lg:col-span-8 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Description (what's wrong, steps to reproduce)…"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
            <textarea
              className="lg:col-span-4 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Internal notes (optional)…"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
            />
            <div className="lg:col-span-8 flex items-center gap-3">
              <label className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 cursor-pointer">
                {screenshotFile ? 'Change Screenshot' : 'Add Screenshot'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                  disabled={submitting}
                />
              </label>
              {screenshotFile && (
                <button
                  type="button"
                  onClick={() => {
                    setScreenshotFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
                  disabled={submitting}
                >
                  Remove Screenshot
                </button>
              )}
            </div>
            <div className="lg:col-span-4 flex items-center justify-end gap-2">
              <button 
                type="button" 
                onClick={resetForm} 
                className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
                disabled={submitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Issue
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </header>

      {/* Filters & Search */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                placeholder="Search issues…"
                className="w-full sm:w-64 rounded-lg border pl-10 pr-3 py-2 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | 'All')}
            >
              {['All', ...statuses].map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'All')}
            >
              {['All', ...priorities].map((p) => (
                <option key={p} value={p}>
                  Priority: {p}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | 'All')}
            >
              {['All', ...categories].map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-600">Sort by</label>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="priority">Priority</option>
              <option value="date">Date</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
              title="Toggle sort direction"
              type="button"
            >
              {sortDir === 'asc' ? 'Asc ↑' : 'Desc ↓'}
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="overflow-hidden rounded-xl border">
          <table className="min-w-full divide-y">
            <thead className="bg-zinc-50">
              <tr className="text-left text-xs font-semibold text-zinc-600">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-zinc-400" />
                    <p className="mt-2 text-sm text-zinc-500">Loading issues...</p>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-500">
                    No issues found. Add your first issue above.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="align-top hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(issue.id)}
                        className={clsx(
                          'rounded-lg border px-2 py-1 text-xs hover:bg-zinc-50',
                          issue.status === 'Open' ? 'border-blue-200' : 'border-zinc-200'
                        )}
                        title="Toggle status"
                      >
                        <Badge variant={issue.status}>{issue.status}</Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{issue.title}</div>
                      {issue.description && (
                        <div className="mt-1 text-sm text-zinc-600 whitespace-pre-wrap">
                          {issue.description}
                        </div>
                      )}
                      {issue.screenshot_url && (
                        <a
                          href={issue.screenshot_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs underline text-zinc-600"
                        >
                          View screenshot
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {issue.url ? (
                        <a 
                          className="text-sm underline break-all" 
                          href={issue.url} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          {issue.url}
                        </a>
                      ) : (
                        <span className="text-sm text-zinc-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="Low">{issue.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={issue.priority}>{issue.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-700">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {issue.creator?.email?.split('@')[0] || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        className="w-64 rounded-lg border px-2 py-1 text-sm"
                        rows={3}
                        placeholder="Add notes…"
                        value={issue.notes || ''}
                        onChange={(e) => updateNotes(issue.id, e.target.value)}
                        onBlur={() => loadIssues()} // Reload to sync with others
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteIssue(issue.id)}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 flex items-center gap-1"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}