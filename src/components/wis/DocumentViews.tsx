import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Eye,
  Clock,
  DollarSign,
  Package,
  Calendar
} from 'lucide-react';
import { WISProcedure, WISPart, WISBulletin } from '@/lib/unified-wis-search';

// Procedures View Component
interface ProceduresViewProps {
  procedures: WISProcedure[];
  onDocumentView: (procedure: WISProcedure) => void;
}

export function ProceduresView({ procedures, onDocumentView }: ProceduresViewProps) {
  if (procedures.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No procedures found for your search</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Workshop Procedures ({procedures.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {procedures.map((procedure) => (
            <div
              key={procedure.id}
              className="border rounded-lg p-4 bg-white hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{procedure.title}</h3>
                    <div className="flex items-center gap-4 mb-2 text-sm text-gray-600 flex-wrap">
                      <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {procedure.procedure_code}
                      </span>
                      {procedure.category && (
                        <span>Category: {procedure.category}</span>
                      )}
                      {procedure.difficulty_level && (
                        <span className="flex items-center gap-1">
                          Difficulty: {procedure.difficulty_level}/5
                        </span>
                      )}
                      {procedure.estimated_time_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {procedure.estimated_time_minutes} min
                        </span>
                      )}
                    </div>
                    {procedure.description && (
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                        {procedure.description}
                      </p>
                    )}
                    {procedure.tools_required && procedure.tools_required.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500 mb-1 block">TOOLS REQUIRED:</span>
                        <div className="flex flex-wrap gap-1">
                          {procedure.tools_required.slice(0, 3).map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {procedure.tools_required.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{procedure.tools_required.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    {procedure.vehicle && (
                      <p className="text-xs text-gray-500">
                        Vehicle: {procedure.vehicle.model_name}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDocumentView(procedure)}
                  className="ml-4 flex-shrink-0"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Parts View Component
interface PartsViewProps {
  parts: WISPart[];
  onDocumentView: (part: WISPart) => void;
}

export function PartsView({ parts, onDocumentView }: PartsViewProps) {
  if (parts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No parts found for your search</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-green-500" />
          Parts Catalog ({parts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parts.map((part) => (
            <div
              key={part.id}
              className="border rounded-lg p-4 bg-white hover:bg-green-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Wrench className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{part.part_name}</h3>
                      <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {part.part_number}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2 text-sm text-gray-600 flex-wrap">
                      {part.category && (
                        <span>Category: {part.category}</span>
                      )}
                      {part.price_estimate && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${part.price_estimate}
                        </span>
                      )}
                      {part.availability_status && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            part.availability_status === 'available' 
                              ? 'border-green-300 text-green-700' 
                              : part.availability_status === 'discontinued'
                              ? 'border-red-300 text-red-700'
                              : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          <Package className="w-3 h-3 mr-1" />
                          {part.availability_status}
                        </Badge>
                      )}
                    </div>
                    
                    {part.description && (
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                        {part.description}
                      </p>
                    )}
                    
                    {part.superseded_by && (
                      <div className="mb-3 bg-orange-50 border border-orange-200 rounded p-2">
                        <p className="text-xs text-orange-800">
                          ⚠️ This part has been superseded by: <span className="font-mono font-medium">{part.superseded_by}</span>
                        </p>
                      </div>
                    )}
                    
                    {part.vehicle && (
                      <p className="text-xs text-gray-500">
                        Vehicle: {part.vehicle.model_name}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDocumentView(part)}
                  className="ml-4 flex-shrink-0"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Bulletins View Component
interface BulletinsViewProps {
  bulletins: WISBulletin[];
  onDocumentView: (bulletin: WISBulletin) => void;
}

export function BulletinsView({ bulletins, onDocumentView }: BulletinsViewProps) {
  if (bulletins.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No service bulletins found for your search</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Service Bulletins ({bulletins.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              className="border rounded-lg p-4 bg-white hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{bulletin.title}</h3>
                      <span className="font-mono bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {bulletin.bulletin_number}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2 text-sm text-gray-600 flex-wrap">
                      {bulletin.category && (
                        <span>Category: {bulletin.category}</span>
                      )}
                      {bulletin.severity && (
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
                          {bulletin.severity.toUpperCase()}
                        </Badge>
                      )}
                      {bulletin.date_issued && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(bulletin.date_issued).toLocaleDateString()}
                        </span>
                      )}
                      {bulletin.status && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            bulletin.status === 'active' 
                              ? 'border-green-300 text-green-700' 
                              : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          {bulletin.status}
                        </Badge>
                      )}
                    </div>
                    
                    {bulletin.description && (
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                        {bulletin.description}
                      </p>
                    )}
                    
                    {bulletin.vehicle && (
                      <p className="text-xs text-gray-500">
                        Vehicle: {bulletin.vehicle.model_name}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDocumentView(bulletin)}
                  className="ml-4 flex-shrink-0"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}