import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { 
  WISModel, 
  WISDocument, 
  WISChunk,
  WIS_MODELS,
  wisSearch, 
  getFullDocument,
  groupChunksByDocument,
  filterByDocType,
  filterWiringDiagrams
} from '@/lib/supabase-wis';
import { ModelSelector } from './ModelSelector';
import { MediaGallery } from './MediaGallery';

interface WorkshopSearchProps {
  defaultModel?: string;
}

export function WorkshopSearch({ defaultModel = "U1700L" }: WorkshopSearchProps) {
  const [selectedModel, setSelectedModel] = useState<WISModel>(
    WIS_MODELS.find(m => m.code === defaultModel) || WIS_MODELS[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<WISDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('procedures');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const chunks = await wisSearch(searchQuery, selectedModel.prefix);
      const groupedDocs = groupChunksByDocument(chunks);
      setDocuments(groupedDocs);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleDocExpansion = async (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    
    if (expandedDocs.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
      
      // Load full document if not already expanded
      const doc = documents.find(d => d.doc_id === docId);
      if (doc && doc.chunks.length <= 3) { // Assuming search returns top 3 chunks
        try {
          const fullChunks = await getFullDocument(docId);
          const updatedDocs = documents.map(d => 
            d.doc_id === docId 
              ? { ...d, chunks: fullChunks }
              : d
          );
          setDocuments(updatedDocs);
        } catch (error) {
          console.error('Failed to load full document:', error);
        }
      }
    }
    
    setExpandedDocs(newExpanded);
  };

  // Filter documents by current tab
  const getFilteredDocuments = () => {
    switch (activeTab) {
      case 'procedures':
        return filterByDocType(documents, 'procedure');
      case 'parts':
        return filterByDocType(documents, 'part');
      case 'bulletins':
        return filterByDocType(documents, 'bulletin');
      case 'wiring':
        return filterWiringDiagrams(documents);
      default:
        return documents;
    }
  };

  const filteredDocs = getFilteredDocuments();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Mercedes-Benz Workshop Information System (WIS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About the Workshop Information System</h3>
            <p className="text-blue-100">
              Access the official Mercedes Workshop Information System - the comprehensive digital database used by 
              Mercedes-Benz dealerships and certified mechanics worldwide. This system replaced traditional paper manuals 
              and microfilm documentation, providing:
            </p>
            <ul className="text-blue-100 ml-6 space-y-1 list-disc">
              <li>Step-by-step repair procedures for all Unimog models (1985-present)</li>
              <li>Exploded parts diagrams and component identification</li>
              <li>Wiring schematics and electrical troubleshooting guides</li>
              <li>Torque specifications and fluid requirements</li>
              <li>Technical Service Bulletins (TSBs) and recalls</li>
            </ul>
            <p className="text-xs text-blue-200">
              This is the same resource used by Mercedes technicians for warranty work and ensures all repairs follow factory specifications.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Model selector */}
        <div className="col-span-12 lg:col-span-3">
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>

        {/* Main content */}
        <div className="col-span-12 lg:col-span-9">
          {/* Search Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Workshop Database
              </CardTitle>
              <p className="text-sm text-gray-600">
                Searching within: {selectedModel.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search part number or procedure..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {documents.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="procedures" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Procedures ({filterByDocType(documents, 'procedure').length})
                </TabsTrigger>
                <TabsTrigger value="parts" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Parts ({filterByDocType(documents, 'part').length})
                </TabsTrigger>
                <TabsTrigger value="bulletins" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Bulletins ({filterByDocType(documents, 'bulletin').length})
                </TabsTrigger>
                <TabsTrigger value="wiring" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Wiring ({filterWiringDiagrams(documents).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="procedures" className="mt-6">
                <DocumentSection 
                  title="Workshop Procedures"
                  documents={filteredDocs}
                  expandedDocs={expandedDocs}
                  onToggleExpansion={toggleDocExpansion}
                />
              </TabsContent>

              <TabsContent value="parts" className="mt-6">
                <DocumentSection 
                  title="Parts Catalog"
                  documents={filteredDocs}
                  expandedDocs={expandedDocs}
                  onToggleExpansion={toggleDocExpansion}
                />
              </TabsContent>

              <TabsContent value="bulletins" className="mt-6">
                <DocumentSection 
                  title="Service Bulletins"
                  documents={filteredDocs}
                  expandedDocs={expandedDocs}
                  onToggleExpansion={toggleDocExpansion}
                />
              </TabsContent>

              <TabsContent value="wiring" className="mt-6">
                <DocumentSection 
                  title="Wiring Diagrams"
                  documents={filteredDocs}
                  expandedDocs={expandedDocs}
                  onToggleExpansion={toggleDocExpansion}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Empty state */}
          {documents.length === 0 && !loading && searchQuery && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  Try different search terms or check your spelling.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface DocumentSectionProps {
  title: string;
  documents: WISDocument[];
  expandedDocs: Set<string>;
  onToggleExpansion: (docId: string) => void;
}

function DocumentSection({ title, documents, expandedDocs, onToggleExpansion }: DocumentSectionProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No {title.toLowerCase()} found for your search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.doc_id}
              document={doc}
              isExpanded={expandedDocs.has(doc.doc_id)}
              onToggleExpansion={() => onToggleExpansion(doc.doc_id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DocumentCardProps {
  document: WISDocument;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}

function DocumentCard({ document, isExpanded, onToggleExpansion }: DocumentCardProps) {
  const getDocTypeIcon = (docType: string) => {
    switch (docType) {
      case 'procedure': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'part': return <Wrench className="w-5 h-5 text-green-500" />;
      case 'bulletin': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDocTypeBadge = (docType: string) => {
    const colors = {
      procedure: 'bg-blue-100 text-blue-800',
      part: 'bg-green-100 text-green-800',
      bulletin: 'bg-orange-100 text-orange-800'
    };
    return colors[docType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Show top 2 chunks when collapsed, all when expanded
  const displayChunks = isExpanded ? document.chunks : document.chunks.slice(0, 2);
  const hasMoreChunks = document.chunks.length > 2;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {getDocTypeIcon(document.doc_type)}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getDocTypeBadge(document.doc_type)}>
                {document.doc_type.charAt(0).toUpperCase() + document.doc_type.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">{document.ref}</span>
            </div>
          </div>
        </div>
        
        {hasMoreChunks && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleExpansion}
            className="ml-4"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Open full doc
              </>
            )}
          </Button>
        )}
      </div>

      {/* Chunks */}
      <div className="space-y-3">
        {displayChunks.map((chunk, index) => (
          <div key={`${chunk.doc_id}-${chunk.chunk_index || index}`} className="pl-4 border-l-2 border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              {chunk.content}
            </p>
          </div>
        ))}
      </div>

      {/* Media Gallery */}
      {document.media.length > 0 && (
        <div className="mt-4">
          <MediaGallery media={document.media} />
        </div>
      )}
    </div>
  );
}