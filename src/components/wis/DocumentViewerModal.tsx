import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator'; // Not needed for now
import { 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Clock,
  DollarSign,
  Package,
  Calendar,
  User,
  Settings,
  AlertCircle,
  CheckCircle,
  X,
  Image,
  Download,
  Printer,
  Copy,
  ExternalLink,
  MessageCircle,
  Bookmark,
  Share2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Grid,
  List
} from 'lucide-react';
import { UnifiedWISResult, WISProcedure, WISPart, WISBulletin } from '@/lib/unified-wis-search';

interface DocumentViewerModalProps {
  activeDocument: any;
  documentType: string;
  onClose: () => void;
  onOpenInBarry?: (document: any) => void;
}

export function DocumentViewerModal({ activeDocument, documentType, onClose, onOpenInBarry }: DocumentViewerModalProps) {
  if (!activeDocument) return null;

  const renderDocumentContent = () => {
    switch (documentType) {
      case 'procedure':
        return <ProcedureViewer procedure={activeDocument} />;
      case 'part':
        return <PartViewer part={activeDocument} />;
      case 'bulletin':
        return <BulletinViewer bulletin={activeDocument} />;
      default:
        return <UnifiedResultViewer result={activeDocument} />;
    }
  };

  const getModalTitle = () => {
    switch (documentType) {
      case 'procedure':
        return `Procedure: ${activeDocument.title}`;
      case 'part':
        return `Part: ${activeDocument.part_number} - ${activeDocument.part_name}`;
      case 'bulletin':
        return `Bulletin: ${activeDocument.title}`;
      default:
        return `${activeDocument.doc_type}: ${activeDocument.title}`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    // TODO: Generate and copy shareable link
    navigator.clipboard.writeText(window.location.href);
  };

  const handleOpenInBarry = () => {
    if (onOpenInBarry) {
      onOpenInBarry(activeDocument);
    }
  };

  return (
    <Dialog open={!!activeDocument} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Enhanced Header with Toolbar */}
        <DialogHeader className="border-b pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold truncate pr-4">
              {getModalTitle()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Professional Toolbar */}
          <div className="flex items-center gap-2 pt-2 border-t bg-gray-50 -mx-6 px-6 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInBarry}
                className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4" />
                Open in Barry
              </Button>
            </div>

            <div className="mx-4 h-4 w-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Bookmark className="w-4 h-4" />
                Bookmark
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="outline" className="text-xs">
                {activeDocument?.doc_type?.charAt(0).toUpperCase() + activeDocument?.doc_type?.slice(1) || 'Document'}
              </Badge>
              {activeDocument?.reference_number && (
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {activeDocument.reference_number}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Individual viewer components
function ProcedureViewer({ procedure }: { procedure: WISProcedure }) {
  return (
    <div className="space-y-6">
      {/* Procedure Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-xl mb-2">{procedure.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-blue-700">Procedure Code:</span>
                <div className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                  {procedure.procedure_code}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">Category:</span>
                <div className="mt-1">{procedure.category || 'General'}</div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">Difficulty:</span>
                <div className="mt-1 flex items-center gap-1">
                  {procedure.difficulty_level || 'Unknown'}/5
                  {procedure.difficulty_level && (
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < procedure.difficulty_level! ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-700">Est. Time:</span>
                <div className="mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {procedure.estimated_time_minutes || 'Unknown'} min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Required */}
      {procedure.tools_required && procedure.tools_required.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Tools Required
          </h4>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {procedure.tools_required.map((tool, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {procedure.description && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Description</h4>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{procedure.description}</p>
          </div>
        </div>
      )}

      {/* Full Content - ENHANCED to show complete technical details */}
      {procedure.content && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Complete Procedure Details</h4>
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-sans">
                {procedure.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Additional chunk content if available */}
      {procedure.chunks && procedure.chunks.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">
            Detailed Technical Information ({procedure.chunks.length} sections)
          </h4>
          <div className="space-y-4">
            {procedure.chunks.map((chunk: any, index: number) => (
              <div key={chunk.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Section {chunk.chunk_index + 1 || index + 1}
                  </Badge>
                  {chunk.ref && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {chunk.ref}
                    </Badge>
                  )}
                </div>
                <div className="text-sm leading-relaxed text-gray-700">
                  {chunk.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Media Gallery with Horizontal Scroll */}
      {procedure.media && procedure.media.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Technical Media ({procedure.media.length} items)
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Horizontal Scrolling Gallery */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
              {procedure.media.map((item: any, index: number) => (
                <div key={index} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Media Preview */}
                  {item.signed_url && item.type?.toLowerCase().includes('image') ? (
                    <div className="relative h-32 bg-gray-100 overflow-hidden">
                      <img
                        src={item.signed_url}
                        alt={item.description || 'Technical diagram'}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(item.signed_url, '_blank')}
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-auto p-1 bg-black/50 hover:bg-black/70 text-white border-none"
                          onClick={() => window.open(item.signed_url, '_blank')}
                        >
                          <ZoomIn className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-500">
                          {item.type?.toUpperCase() || 'DOCUMENT'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.type?.toUpperCase() || 'MEDIA'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {item.signed_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(item.signed_url, '_blank')}
                            className="h-auto p-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-700 space-y-1">
                      <div className="font-medium truncate" title={item.file_name}>
                        {item.file_name}
                      </div>
                      {item.description && (
                        <div className="text-gray-600 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation arrows for long galleries */}
            {procedure.media.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Media Types Summary */}
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
            <span>Media types:</span>
            {Array.from(new Set(procedure.media.map((m: any) => m.type || 'unknown'))).map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Information */}
      {procedure.vehicle && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <User className="w-5 h-5" />
            Vehicle Application
          </h4>
          <div className="text-sm">
            <div className="font-semibold">{procedure.vehicle.model_name}</div>
            <div className="text-green-700">
              Code: {procedure.vehicle.model_code}
              {procedure.vehicle.year_from && procedure.vehicle.year_to && (
                <span> | Years: {procedure.vehicle.year_from}-{procedure.vehicle.year_to}</span>
              )}
              {procedure.vehicle.engine_code && (
                <span> | Engine: {procedure.vehicle.engine_code}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PartViewer({ part }: { part: WISPart }) {
  return (
    <div className="space-y-6">
      {/* Part Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Wrench className="w-6 h-6 text-green-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-green-900 text-xl mb-2">{part.part_name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-green-700">Part Number:</span>
                <div className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded mt-1">
                  {part.part_number}
                </div>
              </div>
              <div>
                <span className="font-semibold text-green-700">Category:</span>
                <div className="mt-1">{part.category || 'General'}</div>
              </div>
              <div>
                <span className="font-semibold text-green-700">Price Est.:</span>
                <div className="mt-1 flex items-center gap-1">
                  {part.price_estimate ? (
                    <>
                      <DollarSign className="w-3 h-3" />
                      ${part.price_estimate}
                    </>
                  ) : (
                    'Contact dealer'
                  )}
                </div>
              </div>
              <div>
                <span className="font-semibold text-green-700">Availability:</span>
                <div className="mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      part.availability_status === 'available' 
                        ? 'border-green-300 text-green-700 bg-green-50' 
                        : part.availability_status === 'discontinued'
                        ? 'border-red-300 text-red-700 bg-red-50'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    {part.availability_status || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Superseded Information */}
      {part.superseded_by && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Notice
          </h4>
          <p className="text-orange-800">
            ⚠️ This part has been superseded by: <span className="font-mono font-bold">{part.superseded_by}</span>
          </p>
          <p className="text-sm text-orange-700 mt-1">
            Please use the superseding part number for current applications.
          </p>
        </div>
      )}

      {/* Description */}
      {part.description && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Description</h4>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{part.description}</p>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {part.notes && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Technical Notes</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 leading-relaxed">{part.notes}</p>
          </div>
        </div>
      )}

      {/* Additional chunk content if available */}
      {part.chunks && part.chunks.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">
            Detailed Part Information ({part.chunks.length} sections)
          </h4>
          <div className="space-y-4">
            {part.chunks.map((chunk: any, index: number) => (
              <div key={chunk.id || index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Section {chunk.chunk_index + 1 || index + 1}
                  </Badge>
                  {chunk.ref && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      {chunk.ref}
                    </Badge>
                  )}
                </div>
                <div className="text-sm leading-relaxed text-green-900">
                  {chunk.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Gallery */}
      {part.media && part.media.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Part Media ({part.media.length} items)
          </h4>
          <div className="text-sm text-gray-600">
            {part.media.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2 py-1">
                <Badge variant="outline" className="text-xs">{item.type || 'Media'}</Badge>
                <span>{item.file_name}</span>
                {item.signed_url && (
                  <Button variant="ghost" size="sm" onClick={() => window.open(item.signed_url, '_blank')}>
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Information */}
      {part.vehicle && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <User className="w-5 h-5" />
            Vehicle Application
          </h4>
          <div className="text-sm">
            <div className="font-semibold">{part.vehicle.model_name}</div>
            <div className="text-green-700">
              Code: {part.vehicle.model_code}
              {part.vehicle.year_from && part.vehicle.year_to && (
                <span> | Years: {part.vehicle.year_from}-{part.vehicle.year_to}</span>
              )}
              {part.vehicle.engine_code && (
                <span> | Engine: {part.vehicle.engine_code}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BulletinViewer({ bulletin }: { bulletin: WISBulletin }) {
  return (
    <div className="space-y-6">
      {/* Bulletin Header */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-orange-900 text-xl mb-2">{bulletin.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-orange-700">Bulletin Number:</span>
                <div className="font-mono bg-orange-100 text-orange-800 px-2 py-1 rounded mt-1">
                  {bulletin.bulletin_number}
                </div>
              </div>
              <div>
                <span className="font-semibold text-orange-700">Severity:</span>
                <div className="mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      bulletin.severity === 'critical' 
                        ? 'border-red-300 text-red-700 bg-red-50' 
                        : bulletin.severity === 'high'
                        ? 'border-orange-300 text-orange-700 bg-orange-50'
                        : bulletin.severity === 'medium'
                        ? 'border-yellow-300 text-yellow-700 bg-yellow-50'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {bulletin.severity?.toUpperCase() || 'INFO'}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="font-semibold text-orange-700">Issue Date:</span>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {bulletin.date_issued ? new Date(bulletin.date_issued).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
              <div>
                <span className="font-semibold text-orange-700">Status:</span>
                <div className="mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      bulletin.status === 'active' 
                        ? 'border-green-300 text-green-700 bg-green-50' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {bulletin.status?.toUpperCase() || 'ACTIVE'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {bulletin.description && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Description</h4>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{bulletin.description}</p>
          </div>
        </div>
      )}

      {/* Full Content - ENHANCED to show complete bulletin details */}
      {bulletin.content && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Complete Technical Service Bulletin</h4>
          <div className="bg-white border-2 border-orange-200 rounded-lg p-6">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-sans">
                {bulletin.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Additional chunk content if available */}
      {bulletin.chunks && bulletin.chunks.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">
            Detailed Service Information ({bulletin.chunks.length} sections)
          </h4>
          <div className="space-y-4">
            {bulletin.chunks.map((chunk: any, index: number) => (
              <div key={chunk.id || index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Section {chunk.chunk_index + 1 || index + 1}
                  </Badge>
                  {chunk.ref && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                      {chunk.ref}
                    </Badge>
                  )}
                </div>
                <div className="text-sm leading-relaxed text-orange-900">
                  {chunk.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Gallery */}
      {bulletin.media && bulletin.media.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Service Bulletin Media ({bulletin.media.length} items)
          </h4>
          <div className="text-sm text-gray-600">
            {bulletin.media.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2 py-1">
                <Badge variant="outline" className="text-xs">{item.type || 'Media'}</Badge>
                <span>{item.file_name}</span>
                {item.signed_url && (
                  <Button variant="ghost" size="sm" onClick={() => window.open(item.signed_url, '_blank')}>
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Information */}
      {bulletin.vehicle && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <User className="w-5 h-5" />
            Vehicle Application
          </h4>
          <div className="text-sm">
            <div className="font-semibold">{bulletin.vehicle.model_name}</div>
            <div className="text-green-700">
              Code: {bulletin.vehicle.model_code}
              {bulletin.vehicle.year_from && bulletin.vehicle.year_to && (
                <span> | Years: {bulletin.vehicle.year_from}-{bulletin.vehicle.year_to}</span>
              )}
              {bulletin.vehicle.engine_code && (
                <span> | Engine: {bulletin.vehicle.engine_code}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UnifiedResultViewer({ result }: { result: UnifiedWISResult }) {
  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          {result.doc_type === 'procedure' && <FileText className="w-6 h-6 text-blue-600 mt-1" />}
          {result.doc_type === 'part' && <Wrench className="w-6 h-6 text-green-600 mt-1" />}
          {result.doc_type === 'bulletin' && <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />}
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-xl mb-2">{result.title}</h3>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="text-xs">
                {result.doc_type.charAt(0).toUpperCase() + result.doc_type.slice(1)}
              </Badge>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {result.reference_number}
              </span>
              {result.category && <span>{result.category}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content Summary */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3">Summary</h4>
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{result.content_summary}</p>
        </div>
      </div>

      {/* Full Content */}
      {result.full_content && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Full Content</h4>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {result.full_content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}