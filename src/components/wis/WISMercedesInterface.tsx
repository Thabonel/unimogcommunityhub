import React, { useState, useEffect } from 'react';
import { Search, Settings, FileText, Package, AlertCircle, BookmarkPlus, Download, ShoppingCart, Clock, Wrench, Star, Folder, User, Printer, FileDown, Eye, Image as ImageIcon, Play, Grid3X3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { toast } from 'sonner';
import { WISExporter } from '@/utils/wis-export';
import { WISDocumentDisplay } from './WISDocumentDisplay';
import { WISSearchSuggestion } from './WISPredictiveSearch';
import { WISMediaBrowser } from './WISMediaBrowser';

interface WISMercedesInterfaceProps {
  barryContext?: any;
  onBarryRequest?: (query: string, vehicleModel?: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  content_type: 'procedure' | 'part' | 'bulletin' | 'document';
  category?: string;
  difficulty_level?: number;
  estimated_time_minutes?: number;
  part_number?: string;
  availability_status?: string;
  procedure_code?: string;
  tools_required?: string[];
  parts_required?: string[];
  safety_warnings?: string[];
  media?: Array<{
    type: 'photo' | 'diagram' | 'table' | 'document' | 'image' | 'pdf';
    bucket: string;
    file_name: string;
    description: string;
    signed_url?: string;
  }>;
}

interface CategoryStats {
  [key: string]: number;
}

const WISMercedesInterface: React.FC<WISMercedesInterfaceProps> = ({
  barryContext,
  onBarryRequest
}) => {
  const { user } = useAuth();
  const { userData } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('media');
  const [selectedVehicle, setSelectedVehicle] = useState(userData?.unimogModel || 'U1700L');
  const [categoryStats, setCategoryStats] = useState<CategoryStats>({});
  const [bookmarks, setBookmarks] = useState<SearchResult[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WISSearchSuggestion | null>(null);

  // Sample suggestion chips
  const suggestionChips = [
    'Portal hub seal',
    'Oil change OM352',
    'Brake adjustment',
    'Transmission fluid',
    'Air filter replacement'
  ];

  // Category mapping with icons
  const categoryIcons: { [key: string]: string } = {
    'Engine': '🔧',
    'Transmission': '⚙️',
    'Portal Hubs & Axles': '🔩',
    'Hydraulics': '💧',
    'Electrical': '⚡',
    'Brakes': '🛑',
    'Cooling System': '❄️'
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        // Allow escape to work even in inputs
        if (event.key === 'Escape') {
          (event.target as HTMLInputElement).blur();
          setSearchQuery('');
          setSearchResults([]);
          setSelectedResultIndex(-1);
        }
        return;
      }

      const filteredResults = getResultsForTab(activeTab);

      switch (event.key) {
        case '/':
          event.preventDefault();
          document.querySelector('.search-input-enhanced')?.focus();
          break;

        case 'Escape':
          setSearchQuery('');
          setSearchResults([]);
          setSelectedResultIndex(-1);
          (document.querySelector('.search-input-enhanced') as HTMLInputElement)?.blur();
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (filteredResults.length > 0) {
            setSelectedResultIndex(prev =>
              prev < filteredResults.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (filteredResults.length > 0) {
            setSelectedResultIndex(prev =>
              prev > 0 ? prev - 1 : filteredResults.length - 1
            );
          }
          break;

        case 'Enter':
          if (selectedResultIndex >= 0 && selectedResultIndex < filteredResults.length) {
            event.preventDefault();
            // Could add action here like opening the selected result
            console.log('Selected result:', filteredResults[selectedResultIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedResultIndex, searchResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedResultIndex(-1);
  }, [searchResults, activeTab]);

  const loadInitialData = async () => {
    try {
      // Load category statistics
      const { data: procedures } = await supabase
        .from('wis_procedures')
        .select('category')
        .not('category', 'is', null);

      const stats: CategoryStats = {};
      procedures?.forEach(proc => {
        if (proc.category) {
          stats[proc.category] = (stats[proc.category] || 0) + 1;
        }
      });
      setCategoryStats(stats);

      // Load user bookmarks if logged in
      if (user) {
        loadBookmarks();
        loadRecentActivity();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      const { data: bookmarkData } = await supabase
        .from('wis_bookmarks')
        .select(`
          id,
          notes,
          wis_procedures!inner(
            id,
            title,
            category,
            description,
            procedure_code,
            difficulty_level,
            estimated_time_minutes
          )
        `)
        .eq('user_id', user.id)
        .limit(5);

      if (bookmarkData) {
        const bookmarkResults = bookmarkData.map(bookmark => ({
          id: bookmark.wis_procedures.id,
          title: bookmark.wis_procedures.title,
          description: bookmark.wis_procedures.description,
          content_type: 'procedure' as const,
          category: bookmark.wis_procedures.category,
          difficulty_level: bookmark.wis_procedures.difficulty_level,
          estimated_time_minutes: bookmark.wis_procedures.estimated_time_minutes,
          procedure_code: bookmark.wis_procedures.procedure_code
        }));
        setBookmarks(bookmarkResults);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const loadRecentActivity = async () => {
    if (!user) return;

    try {
      const { data: logs } = await supabase
        .from('wis_usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(logs || []);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchQuery(query);

    try {
      // If Barry request handler is available, use it
      if (onBarryRequest) {
        await onBarryRequest(query, selectedVehicle);
      }

      // Also perform direct database search
      await performDirectSearch(query);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const performDirectSearch = async (query: string) => {
    const searchTerm = `%${query}%`;
    const results: SearchResult[] = [];

    try {
      // Search procedures
      const { data: procedures } = await supabase
        .from('wis_procedures')
        .select('id, title, description, category, difficulty_level, estimated_time_minutes, procedure_code, tools_required, parts_required, safety_warnings')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(10);

      if (procedures) {
        results.push(...procedures.map(p => ({
          ...p,
          content_type: 'procedure' as const
        })));
      }

      // Search parts
      const { data: parts } = await supabase
        .from('wis_parts')
        .select('id, part_number, part_name as title, description, category, availability_status')
        .or(`part_name.ilike.${searchTerm},description.ilike.${searchTerm},part_number.ilike.${searchTerm}`)
        .limit(10);

      if (parts) {
        results.push(...parts.map(p => ({
          ...p,
          content_type: 'part' as const
        })));
      }

      // Search bulletins
      const { data: bulletins } = await supabase
        .from('wis_bulletins')
        .select('id, title, content as description')
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

      if (bulletins) {
        results.push(...bulletins.map(b => ({
          ...b,
          content_type: 'bulletin' as const
        })));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Direct search error:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleCategoryClick = (category: string) => {
    const query = `category:${category}`;
    setSearchQuery(query);
    handleSearch(category);
  };

  const handleBookmark = async (result: SearchResult) => {
    if (!user) {
      toast.error('Please sign in to bookmark items');
      return;
    }

    try {
      // Check if already bookmarked
      const isBookmarked = bookmarks.some(b => b.id === result.id);

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('wis_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('procedure_id', result.id);

        if (error) throw error;

        setBookmarks(prev => prev.filter(b => b.id !== result.id));
        toast.success('Removed from bookmarks');
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('wis_bookmarks')
          .insert({
            user_id: user.id,
            procedure_id: result.id,
            procedure_title: result.title
          });

        if (error) throw error;

        setBookmarks(prev => [...prev, result]);
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const isBookmarked = (resultId: string) => {
    return bookmarks.some(b => b.id === resultId);
  };

  // Export handlers
  const handleExportPDF = async () => {
    if (!searchResults.length || !searchQuery) {
      toast.error('No search results to export');
      return;
    }

    try {
      setIsExporting(true);
      const exportData = WISExporter.createExportData(
        searchQuery,
        {
          success: true,
          response: barryContext?.response || 'No Barry response available',
          context: { results: searchResults }
        },
        selectedVehicle
      );

      await WISExporter.exportToPDF(exportData, {
        title: `WIS Search: ${searchQuery}`,
        vehicleModel: selectedVehicle,
        includeTimestamp: true
      });

      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!searchResults.length || !searchQuery) {
      toast.error('No search results to export');
      return;
    }

    try {
      setIsExporting(true);
      const exportData = WISExporter.createExportData(
        searchQuery,
        {
          success: true,
          response: barryContext?.response || 'No Barry response available',
          context: { results: searchResults }
        },
        selectedVehicle
      );

      await WISExporter.exportToCSV(exportData, {
        vehicleModel: selectedVehicle,
        includeTimestamp: true
      });

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!searchResults.length || !searchQuery) {
      toast.error('No search results to print');
      return;
    }

    try {
      const exportData = WISExporter.createExportData(
        searchQuery,
        {
          success: true,
          response: barryContext?.response || 'No Barry response available',
          context: { results: searchResults }
        },
        selectedVehicle
      );

      WISExporter.printResults(exportData, {
        vehicleModel: selectedVehicle,
        includeTimestamp: true
      });

      toast.success('Print dialog opened');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to open print dialog');
    }
  };

  const getResultsForTab = (tab: string) => {
    if (tab === 'all') return searchResults;
    return searchResults.filter(result => result.content_type === tab);
  };

  // Convert SearchResult to WISSearchSuggestion format
  const convertToWISSearchSuggestion = (result: SearchResult): WISSearchSuggestion => {
    return {
      id: result.id,
      type: result.content_type === 'procedure' ? 'procedure' :
            result.content_type === 'part' ? 'part' : 'bulletin',
      title: result.title,
      ref: result.procedure_code || result.part_number || result.id,
      category: result.category,
      description: result.description
    };
  };

  // Handle item selection for detailed view
  const handleItemSelect = (result: SearchResult) => {
    const suggestion = convertToWISSearchSuggestion(result);
    setSelectedItem(suggestion);
    toast.success(`Viewing ${result.content_type}: ${result.title}`);
  };

  const getResultBadgeClass = (type: string) => {
    switch (type) {
      case 'procedure':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'part':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'bulletin':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'procedure':
        return <FileText className="w-4 h-4" />;
      case 'part':
        return <Package className="w-4 h-4" />;
      case 'bulletin':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDifficulty = (level?: number) => {
    if (!level) return '';
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert', 'Specialist'];
    return difficulties[level - 1] || 'Unknown';
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo':
      case 'image':
        return <ImageIcon className="w-3 h-3" />;
      case 'diagram':
      case 'table':
      case 'document':
      case 'pdf':
        return <FileText className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const getMediaTypeColor = (type: string) => {
    switch (type) {
      case 'photo':
      case 'image':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'diagram':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'table':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'document':
      case 'pdf':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderMediaPreview = (result: SearchResult) => {
    if (!result.media || result.media.length === 0) return null;

    const displayMedia = result.media.slice(0, 3);
    const hasMore = result.media.length > 3;

    return (
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Grid3X3 className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-600 font-medium">
            {result.media.length} Media File{result.media.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {displayMedia.map((media, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${getMediaTypeColor(media.type)}`}
              title={media.description}
            >
              {getMediaIcon(media.type)}
              <span className="max-w-[80px] truncate">
                {media.description || media.file_name}
              </span>
            </div>
          ))}
          {hasMore && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border text-gray-600 bg-gray-50 border-gray-200">
              <Plus className="w-3 h-3" />
              <span>+{result.media.length - 3} more</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white">
      <style jsx>{`
        .wis-redesign {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          background: #f5f2e8;
          color: #333;
        }

        .quick-access {
          background: #4a7c3c;
          background: linear-gradient(to bottom, #4a7c3c, #3a6c2c);
          color: white;
          padding: 12px 15px;
          border-bottom: 1px solid #2a5c1c;
        }

        .vehicle-selector {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          padding: 6px 10px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          margin-right: 15px;
        }

        .vehicle-selector select {
          border: none;
          background: none;
          color: white;
          font-size: 11px;
          outline: none;
        }

        .vehicle-selector select option {
          background: #4a7c3c;
          color: white;
        }

        .quick-actions {
          display: inline-flex;
          gap: 5px;
        }

        .quick-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          transition: all 0.2s;
        }

        .quick-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        .quick-btn.primary {
          background: rgba(255,255,255,0.9);
          color: #4a7c3c;
          border-color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        .quick-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .quick-btn:disabled:hover {
          background: rgba(255,255,255,0.1);
          transform: none;
        }

        .quick-btn svg {
          display: inline-block;
          vertical-align: middle;
        }

        .search-hero {
          text-align: center;
          padding: 15px 20px;
          background: linear-gradient(135deg, #f9f7f3 0%, #fff 100%);
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .barry-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4a7c3c, #6a9c5c);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }

        .search-input-enhanced {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #4a7c3c;
          border-radius: 25px;
          font-size: 13px;
          transition: all 0.3s;
          margin-bottom: 15px;
        }

        .search-input-enhanced:focus {
          outline: none;
          border-color: #6a9c5c;
          box-shadow: 0 0 0 3px rgba(74, 124, 60, 0.1);
        }

        .search-suggestions {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .suggestion-chip {
          background: #e8e5d9;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggestion-chip:hover {
          background: #4a7c3c;
          color: white;
        }

        .result-tabs {
          display: flex;
          gap: 2px;
          margin-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }

        .result-tab {
          padding: 8px 15px;
          background: #f5f5f5;
          border: none;
          cursor: pointer;
          font-size: 11px;
          position: relative;
          transition: all 0.2s;
        }

        .result-tab.active {
          background: white;
          border-bottom: 2px solid #4a7c3c;
          margin-bottom: -2px;
        }

        .result-tab .count {
          background: #999;
          color: white;
          padding: 1px 5px;
          border-radius: 10px;
          font-size: 9px;
          margin-left: 5px;
        }

        .result-tab.active .count {
          background: #4a7c3c;
        }

        .result-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .result-card:hover {
          border-color: #4a7c3c;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transform: translateX(5px);
        }

        .result-card-selected {
          border-color: #4a7c3c !important;
          background: #f0f8ff !important;
          box-shadow: 0 0 0 2px rgba(74, 124, 60, 0.2) !important;
          transform: translateX(5px) !important;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .result-title {
          font-size: 12px;
          font-weight: bold;
          color: #333;
          flex: 1;
          margin-right: 10px;
        }

        .result-meta {
          display: flex;
          gap: 8px;
          font-size: 10px;
          color: #666;
          align-items: center;
          flex-shrink: 0;
        }

        .result-description {
          color: #666;
          line-height: 1.4;
          margin-bottom: 8px;
          font-size: 11px;
        }

        .result-actions {
          display: flex;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid #f0f0f0;
        }

        .result-action {
          font-size: 10px;
          color: #4a7c3c;
          text-decoration: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .result-action:hover {
          text-decoration: underline;
        }

        .side-panel {
          width: 280px;
          background: #f9f7f3;
          border-left: 1px solid #d0cdb9;
          padding: 15px;
          overflow-y: auto;
          height: 100%;
        }

        .panel-section {
          margin-bottom: 20px;
        }

        .panel-title {
          font-size: 12px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #d0cdb9;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .bookmark-item {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          background: white;
          border-radius: 3px;
          margin-bottom: 5px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 11px;
        }

        .bookmark-item:hover {
          background: #e8e5d9;
        }

        .bookmark-icon {
          margin-right: 8px;
          color: #f57c00;
        }

        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-item {
          padding: 5px 8px;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }

        .category-item:hover {
          background: white;
        }

        .category-count {
          color: #999;
          font-size: 10px;
          background: #e8e5d9;
          padding: 1px 5px;
          border-radius: 10px;
        }

        .loading {
          text-align: center;
          padding: 20px;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f0f0f0;
          border-top-color: #4a7c3c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .side-panel {
            display: none;
          }
        }
      `}</style>

      <div className="wis-redesign">
        {/* Quick Access Bar with Green Theme */}
        <div className="quick-access">
          <div className="vehicle-selector">
            <span>Vehicle:</span>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="U1700L">U1700L (OM352)</option>
              <option value="U1300L">U1300L (OM366)</option>
              <option value="U500">U500 (OM904)</option>
              <option value="All">All Models</option>
            </select>
          </div>
          <div className="quick-actions">
            <button className="quick-btn" onClick={() => handleCategoryClick('Engine')}>
              Common Procedures
            </button>
            <button className="quick-btn" onClick={() => handleSearch('service schedule')}>
              Service Schedule
            </button>
            <button className="quick-btn" onClick={() => handleSearch('diagnostics')}>
              Diagnostics
            </button>
            <button
              className="quick-btn primary"
              onClick={() => document.querySelector('.search-input-enhanced')?.focus()}
            >
              🔍 Ask Barry AI
            </button>
            {searchResults.length > 0 && (
              <>
                <button
                  className="quick-btn"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  title="Export search results to PDF"
                >
                  <FileDown className="w-3 h-3 mr-1" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
                <button
                  className="quick-btn"
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  title="Export parts data to CSV"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export CSV
                </button>
                <button
                  className="quick-btn"
                  onClick={handlePrint}
                  title="Print search results"
                >
                  <Printer className="w-3 h-3 mr-1" />
                  Print
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
          {/* Primary: Smart Search & Results */}
          <div className="flex-1 p-5 overflow-y-auto">
            {/* Barry AI Hero Section */}
            <div className="search-hero">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Hi! I'm Barry, your AI Workshop Assistant
              </h2>
              <p className="text-gray-600 mb-4">
                Ask me anything about your Unimog - I understand natural language and technical terms
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  className="search-input-enhanced"
                  placeholder="e.g., 'How do I replace portal hub seals?' or 'OM352 oil change procedure'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                />
              </div>

              <div className="search-suggestions">
                {suggestionChips.map((suggestion) => (
                  <span
                    key={suggestion}
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>

            {/* Main Content Tabs */}
            <div className="flex-1">
              <div className="result-tabs">
                <button
                  className={`result-tab ${activeTab === 'search' ? 'active' : ''}`}
                  onClick={() => setActiveTab('search')}
                >
                  🔍 Search Results
                  {searchResults.length > 0 && <span className="count">{searchResults.length}</span>}
                </button>
                <button
                  className={`result-tab ${activeTab === 'media' ? 'active' : ''}`}
                  onClick={() => setActiveTab('media')}
                >
                  🎬 Media Gallery <span className="count">10,345</span>
                </button>
                <button
                  className={`result-tab ${activeTab === 'procedures' ? 'active' : ''}`}
                  onClick={() => setActiveTab('procedures')}
                >
                  🔧 Procedures <span className="count">850</span>
                </button>
                <button
                  className={`result-tab ${activeTab === 'parts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('parts')}
                >
                  🔩 Parts <span className="count">3,900</span>
                </button>
                <button
                  className={`result-tab ${activeTab === 'bulletins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bulletins')}
                >
                  📋 Bulletins <span className="count">125</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'search' && (
                <>
                  {/* Loading State */}
                  {isLoading && (
                    <div className="loading">
                      <div className="loading-spinner"></div>
                      <p>Barry is searching the WIS database...</p>
                    </div>
                  )}

                  {/* Barry Context Results */}
                  {barryContext && (
                    <div className="mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="barry-avatar !w-8 !h-8 !text-sm !mb-0 flex-shrink-0">B</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-2">Barry's Response:</h3>
                              <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                                  {barryContext.explanation}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Result Cards */}
                  {!isLoading && searchResults.length > 0 && (
                    <div>
                      {getResultsForTab('all').map((result, index) => (
                        <div
                          key={result.id}
                          className={`result-card ${index === selectedResultIndex ? 'result-card-selected' : ''}`}
                        >
                          <div className="result-header">
                            <div className="result-title">{result.title}</div>
                            <div className="result-meta">
                              <Badge className={getResultBadgeClass(result.content_type)}>
                                {getResultIcon(result.content_type)}
                                <span className="ml-1">{result.content_type.toUpperCase()}</span>
                              </Badge>
                              {result.estimated_time_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(result.estimated_time_minutes)}
                                </span>
                              )}
                              {result.difficulty_level && (
                                <span className="flex items-center gap-1">
                                  <Wrench className="w-3 h-3" />
                                  {formatDifficulty(result.difficulty_level)}
                                </span>
                              )}
                              {result.availability_status && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  result.availability_status === 'In Stock'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {result.availability_status === 'In Stock' ? '✅ In Stock' : '⚠️ ' + result.availability_status}
                                </span>
                              )}
                              {/* Bookmark toggle */}
                              <button
                                className={`bookmark-btn ${isBookmarked(result.id) ? 'bookmarked' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookmark(result);
                                }}
                                title={isBookmarked(result.id) ? 'Remove bookmark' : 'Add bookmark'}
                              >
                                <Star className={`w-3 h-3 ${isBookmarked(result.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                              </button>
                            </div>
                          </div>
                          {result.description && (
                            <div className="result-description">
                              {result.description}
                            </div>
                          )}
                          {/* Media preview */}
                          {renderMediaPreview(result)}
                          <div className="result-actions">
                            <a
                              className="result-action"
                              onClick={() => handleItemSelect(result)}
                              style={{ cursor: 'pointer' }}
                              title="View full details with media and documents"
                            >
                              <Eye className="w-3 h-3" />
                              View {result.content_type === 'procedure' ? 'Procedure' : result.content_type === 'part' ? 'Details' : 'Bulletin'}
                            </a>
                            <a
                              className="result-action"
                              onClick={() => handleBookmark(result)}
                              style={{ cursor: 'pointer' }}
                            >
                              <BookmarkPlus className={`w-3 h-3 ${isBookmarked(result.id) ? 'text-yellow-500' : ''}`} />
                              {isBookmarked(result.id) ? 'Bookmarked' : 'Bookmark'}
                            </a>
                            <a
                              className="result-action"
                              onClick={() => handleExportPDF()}
                              style={{ cursor: 'pointer' }}
                              title="Export this result to PDF"
                            >
                              <Download className="w-3 h-3" />
                              Download PDF
                            </a>
                            {result.content_type === 'part' && (
                              <a className="result-action">
                                <ShoppingCart className="w-3 h-3" />
                                Check Availability
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!isLoading && searchResults.length === 0 && searchQuery && (
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
                      <p className="text-gray-500">
                        Try using different search terms or browse by category
                      </p>
                    </div>
                  )}

                  {/* Initial State */}
                  {!isLoading && searchResults.length === 0 && !searchQuery && (
                    <div className="empty-state">
                      <div className="empty-icon">🔧</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to assist!</h3>
                      <p className="text-gray-500">
                        Enter a search query above or click on a suggestion to get started
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Media Gallery Tab */}
              {activeTab === 'media' && (
                <WISMediaBrowser
                  selectedVehicle={selectedVehicle}
                  searchContext={searchQuery}
                  className="h-full"
                />
              )}

              {/* Procedures Tab */}
              {activeTab === 'procedures' && (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Procedures Browser</h3>
                  <p className="text-gray-500 mb-4">
                    Browse all 850 workshop procedures by category and vehicle model
                  </p>
                  <p className="text-sm text-blue-600">Coming in next update - use Search tab for now</p>
                </div>
              )}

              {/* Parts Tab */}
              {activeTab === 'parts' && (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🔩</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Parts Catalog</h3>
                  <p className="text-gray-500 mb-4">
                    Visual parts browser with exploded diagrams and part numbers
                  </p>
                  <p className="text-sm text-blue-600">Coming in next update - use Search tab for now</p>
                </div>
              )}

              {/* Bulletins Tab */}
              {activeTab === 'bulletins' && (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Service Bulletins</h3>
                  <p className="text-gray-500 mb-4">
                    Browse all 125 service bulletins and technical updates
                  </p>
                  <p className="text-sm text-blue-600">Coming in next update - use Search tab for now</p>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - Quick Access & Context */}
          <aside className="side-panel">
            {/* Quick Access Bookmarks */}
            <div className="panel-section">
              <h3 className="panel-title">
                <Star className="w-4 h-4" />
                Quick Access
              </h3>
              {bookmarks.length > 0 ? (
                bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="bookmark-item">
                    <span className="bookmark-icon">⭐</span>
                    <span>{bookmark.title}</span>
                  </div>
                ))
              ) : (
                <div className="bookmark-item">
                  <span className="bookmark-icon">⭐</span>
                  <span>Engine Oil Service</span>
                </div>
              )}
            </div>

            {/* Browse by Category */}
            <div className="panel-section">
              <h3 className="panel-title">
                <Folder className="w-4 h-4" />
                Browse Categories
              </h3>
              <ul className="category-list">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <li
                    key={category}
                    className="category-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span>{categoryIcons[category] || '📂'} {category}</span>
                    <span className="category-count">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="panel-section">
              <h3 className="panel-title">
                <Clock className="w-4 h-4" />
                Recent Activity
              </h3>
              <div style={{ color: '#999', fontSize: '10px', lineHeight: 1.4 }}>
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 3).map((activity, index) => (
                    <div key={activity.id} style={{ marginBottom: '8px' }}>
                      <strong>
                        {new Date(activity.created_at).toLocaleDateString()}:
                      </strong>
                      <br />
                      {activity.action_type}: {activity.details?.title || 'Item'}
                    </div>
                  ))
                ) : (
                  <>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>2 hrs ago:</strong><br />
                      Viewed "Clutch Adjustment Procedure"
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Yesterday:</strong><br />
                      Downloaded "OM352 Service Manual"
                    </div>
                    <div>
                      <strong>3 days ago:</strong><br />
                      Bookmarked 3 hydraulic procedures
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Document Display Section - Shows detailed view of selected item */}
        {selectedItem && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕ Close
              </Button>
            </div>
            <WISDocumentDisplay
              selectedItem={selectedItem}
              className="border rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WISMercedesInterface;