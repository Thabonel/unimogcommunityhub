import React, { useState } from 'react';
import { TableReference } from '@/services/claude/geminiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn, Table as TableIcon, Download } from 'lucide-react';

interface TableGalleryProps {
  tables: TableReference[];
  className?: string;
}

export function TableGallery({ tables, className = '' }: TableGalleryProps) {
  const [selectedTable, setSelectedTable] = useState<TableReference | null>(null);

  if (!tables || tables.length === 0) {
    return null;
  }

  const getTableTypeIcon = (type: string) => {
    switch (type) {
      case 'specification':
        return '📊';
      case 'torque':
        return '🔧';
      case 'capacity':
        return '⛽';
      case 'dimensions':
        return '📏';
      case 'maintenance':
        return '🛠️';
      case 'parts':
        return '🔩';
      default:
        return '📋';
    }
  };

  const getTableTypeColor = (type: string) => {
    switch (type) {
      case 'specification':
        return 'bg-blue-100 text-blue-800';
      case 'torque':
        return 'bg-orange-100 text-orange-800';
      case 'capacity':
        return 'bg-green-100 text-green-800';
      case 'dimensions':
        return 'bg-purple-100 text-purple-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'parts':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportTableAsCSV = (table: TableReference) => {
    const csvContent = table.rows
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table-page-${table.pageNumber}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const renderTablePreview = (table: TableReference, maxRows: number = 3) => {
    if (!table.rows || table.rows.length === 0) {
      return <p className="text-gray-500 text-sm">No data available</p>;
    }

    const previewRows = table.rows.slice(0, maxRows);
    const hasMoreRows = table.rows.length > maxRows;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 font-medium' : ''}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-200 px-2 py-1 text-left"
                  >
                    {String(cell).substring(0, 20)}
                    {String(cell).length > 20 ? '...' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {hasMoreRows && (
          <p className="text-xs text-gray-400 mt-1">
            +{table.rows.length - maxRows} more rows
          </p>
        )}
      </div>
    );
  };

  const renderFullTable = (table: TableReference) => {
    if (!table.rows || table.rows.length === 0) {
      return <p className="text-gray-500">No data available</p>;
    }

    return (
      <div className="overflow-auto max-h-96">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 px-3 py-2 text-left"
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <TableIcon size={16} className="text-green-600" />
        <span className="text-sm font-medium text-gray-700">
          Related Tables ({tables.length})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tables.map((table, index) => (
          <Card key={table.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getTableTypeIcon(table.type)}
                  {table.description}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getTableTypeColor(table.type)}`}>
                    {table.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Page {table.pageNumber}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                {/* Table Preview */}
                <div className="bg-gray-50 rounded-md p-2">
                  {renderTablePreview(table)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Relevance:</span>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${table.relevance * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(table.relevance * 100)}%
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedTable(table)}
                        >
                          <ZoomIn size={12} className="mr-1" />
                          View Full
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => exportTableAsCSV(table)}
                    >
                      <Download size={12} className="mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Table Modal */}
      {selectedTable && (
        <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTableTypeIcon(selectedTable.type)}
                {selectedTable.description}
                <Badge className={`text-xs ml-auto ${getTableTypeColor(selectedTable.type)}`}>
                  Page {selectedTable.pageNumber}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Full Table */}
              {renderFullTable(selectedTable)}

              {/* Table Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Table Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={`text-xs ${getTableTypeColor(selectedTable.type)}`}>
                        {selectedTable.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Page:</span>
                      <span>{selectedTable.pageNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rows:</span>
                      <span>{selectedTable.rows?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relevance:</span>
                      <span>{Math.round(selectedTable.relevance * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => exportTableAsCSV(selectedTable)}
                    >
                      <Download size={16} className="mr-2" />
                      Download as CSV
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default TableGallery;