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
  X
} from 'lucide-react';
import { UnifiedWISResult, WISProcedure, WISPart, WISBulletin } from '@/lib/unified-wis-search';

interface DocumentViewerModalProps {
  activeDocument: any;
  documentType: string;
  onClose: () => void;
}

export function DocumentViewerModal({ activeDocument, documentType, onClose }: DocumentViewerModalProps) {
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

  return (
    <Dialog open={!!activeDocument} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between text-lg">
            <span className="truncate pr-4">{getModalTitle()}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
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

      {/* Full Content */}
      {procedure.content && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Procedure Steps</h4>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-800">
              {procedure.content}
            </pre>
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
          <h4 className="font-bold text-gray-900 mb-3">Additional Notes</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 leading-relaxed">{part.notes}</p>
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

      {/* Full Content */}
      {bulletin.content && (
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Bulletin Content</h4>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {bulletin.content}
            </pre>
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