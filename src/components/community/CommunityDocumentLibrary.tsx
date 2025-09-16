import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Download,
  Star,
  Eye,
  Calendar,
  Filter,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileImage,
  CheckSquare,
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { communityDocumentService, CommunityDocument, DocumentSearchOptions } from '@/services/community/CommunityDocumentService';
import { DocumentRating } from './DocumentRating';
import { toast } from 'sonner';

interface CommunityDocumentLibraryProps {
  className?: string;
}

const DocumentTypeIcons = {
  powerpoint: Presentation,
  excel: FileSpreadsheet,
  pdf: FileText,
  checklist: CheckSquare,
  procedure: FileImage,
};

export const CommunityDocumentLibrary: React.FC<CommunityDocumentLibraryProps> = ({
  className = ''
}) => {
  const [documents, setDocuments] = useState<CommunityDocument[]>([]);
  const [popularDocs, setPopularDocs] = useState<CommunityDocument[]>([]);
  const [recentDocs, setRecentDocs] = useState<CommunityDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>('');
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'rating_average' | 'download_count'>('created_at');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  // Load initial data
  useEffect(() => {
    loadDocuments();
    loadPopularDocuments();
    loadRecentDocuments();
  }, []);

  // Search when filters change
  useEffect(() => {
    const searchOptions: DocumentSearchOptions = {
      query: searchQuery || undefined,
      document_type: selectedDocType || undefined,
      vehicle_models: selectedVehicleModel ? [selectedVehicleModel] : undefined,
      categories: selectedCategory ? [selectedCategory] : undefined,
      sort_by: sortBy,
      sort_order: 'desc',
      limit: 20,
    };

    loadDocuments(searchOptions);
  }, [searchQuery, selectedCategory, selectedVehicleModel, selectedDocType, sortBy]);

  const loadDocuments = async (options?: DocumentSearchOptions) => {
    setLoading(true);
    try {
      const docs = await communityDocumentService.searchDocuments(options);
      setDocuments(docs);

      // Load user ratings for the documents
      if (docs.length > 0) {
        const documentIds = docs.map(doc => doc.id);
        await loadUserRatings(documentIds);
      }
    } catch (error) {
      console.error('Load documents error:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadPopularDocuments = async () => {
    try {
      const docs = await communityDocumentService.getPopularDocuments(6);
      setPopularDocs(docs);

      // Load user ratings for popular documents
      if (docs.length > 0) {
        const documentIds = docs.map(doc => doc.id);
        await loadUserRatings(documentIds);
      }
    } catch (error) {
      console.error('Load popular documents error:', error);
    }
  };

  const loadRecentDocuments = async () => {
    try {
      const docs = await communityDocumentService.getRecentDocuments(6);
      setRecentDocs(docs);

      // Load user ratings for recent documents
      if (docs.length > 0) {
        const documentIds = docs.map(doc => doc.id);
        await loadUserRatings(documentIds);
      }
    } catch (error) {
      console.error('Load recent documents error:', error);
    }
  };

  const handleDownload = async (document: CommunityDocument) => {
    try {
      const downloadUrl = await communityDocumentService.downloadDocument(document.id);
      if (downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = document.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Downloaded: ${document.title}`);

        // Refresh documents to update download count
        loadDocuments();
      } else {
        toast.error('Failed to download document');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const loadUserRatings = async (documentIds: string[]) => {
    try {
      const ratingsMap: Record<string, number> = {};

      // Load user ratings for all documents
      await Promise.all(
        documentIds.map(async (docId) => {
          const rating = await communityDocumentService.getUserRating(docId);
          if (rating) {
            ratingsMap[docId] = rating.rating;
          }
        })
      );

      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error loading user ratings:', error);
    }
  };

  const handleRatingUpdate = (documentId: string, newAverage: number, newCount: number) => {
    // Update the document in local state
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, rating_average: newAverage, rating_count: newCount }
          : doc
      )
    );

    // Update popular and recent docs as well
    setPopularDocs(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, rating_average: newAverage, rating_count: newCount }
          : doc
      )
    );

    setRecentDocs(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, rating_average: newAverage, rating_count: newCount }
          : doc
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedVehicleModel('');
    setSelectedDocType('');
    setSortBy('created_at');
  };

  const DocumentCard: React.FC<{ document: CommunityDocument; compact?: boolean }> = ({
    document,
    compact = false
  }) => {
    const IconComponent = DocumentTypeIcons[document.document_type] || FileText;

    return (
      <Card className={`hover:shadow-lg transition-all cursor-pointer group ${compact ? 'h-full' : ''}`}>
        <CardContent className={compact ? 'p-4' : 'p-6'}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-military-green/10 text-military-green group-hover:bg-military-green/20 transition-colors`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-foreground truncate ${compact ? 'text-sm' : 'text-base'}`}>
                  {document.title}
                </h3>
                <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                  by {document.creator_name}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(document);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {!compact && document.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {document.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {document.vehicle_models.slice(0, 2).map((model) => (
              <Badge key={model} variant="secondary" className="text-xs">
                {model}
              </Badge>
            ))}
            {document.categories.slice(0, compact ? 1 : 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs capitalize">
                {category}
              </Badge>
            ))}
          </div>

          {/* Rating Component */}
          <DocumentRating
            documentId={document.id}
            currentRating={document.rating_average}
            userRating={userRatings[document.id]}
            onRatingUpdate={(newRating, newCount) =>
              handleRatingUpdate(document.id, newRating, newCount)
            }
            className="mb-2"
          />

          {/* Stats */}
          <div className={`flex items-center justify-between text-xs text-muted-foreground ${compact ? 'gap-1' : 'gap-2'}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{document.download_count} downloads</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(document.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Document Library</h1>
          <p className="text-muted-foreground">
            Discover and download professional Unimog documentation shared by the community
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Recent</SelectItem>
                  <SelectItem value="rating_average">Highest Rated</SelectItem>
                  <SelectItem value="download_count">Most Downloaded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Select value={selectedVehicleModel} onValueChange={setSelectedVehicleModel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Vehicle Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Models</SelectItem>
                  <SelectItem value="U1700L">U1700L</SelectItem>
                  <SelectItem value="U1300L">U1300L</SelectItem>
                  <SelectItem value="U5000">U5000</SelectItem>
                  <SelectItem value="U4000">U4000</SelectItem>
                  <SelectItem value="U2400">U2400</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="hydraulics">Hydraulics</SelectItem>
                  <SelectItem value="engine">Engine</SelectItem>
                  <SelectItem value="transmission">Transmission</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="brakes">Brakes</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="popular">
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDocs.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDocs.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};