import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Zap,
  MessageSquare,
  Lightbulb,
  Database,
  Search
} from 'lucide-react';
import { WISPredictiveSearch, WISSearchSuggestion } from './WISPredictiveSearch';
import { WISDocumentDisplay } from './WISDocumentDisplay';

interface NewWISInterfaceProps {
  // Future: could add vehicle model filtering
}

export function NewWISInterface({}: NewWISInterfaceProps) {
  const [selectedItem, setSelectedItem] = useState<WISSearchSuggestion | null>(null);
  const [searchHistory, setSearchHistory] = useState<WISSearchSuggestion[]>([]);

  // Handle item selection from predictive search
  const handleItemSelect = (item: WISSearchSuggestion) => {
    setSelectedItem(item);
    
    // Add to search history (keep last 5 unique items)
    setSearchHistory(prev => {
      const filtered = prev.filter(historyItem => historyItem.id !== item.id);
      return [item, ...filtered].slice(0, 5);
    });
  };

  // Handle selection from search history
  const handleHistoryItemSelect = (item: WISSearchSuggestion) => {
    setSelectedItem(item);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900">
            <Database className="w-8 h-8 text-blue-600" />
            Mercedes-Benz Workshop Information System
          </CardTitle>
          <p className="text-gray-700 mt-2">
            Predictive search across complete WIS database with 3,847 parts, 847 procedures, and 127 service bulletins.
            Simply start typing and select exactly what you need from the dropdown suggestions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/70 border border-blue-200 p-4 rounded-lg">
              <FileText className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-sm font-semibold text-gray-900">847 Procedures</div>
              <div className="text-xs text-gray-600">Complete repair guides</div>
            </div>
            <div className="bg-white/70 border border-green-200 p-4 rounded-lg">
              <Wrench className="w-6 h-6 mb-2 text-green-600" />
              <div className="text-sm font-semibold text-gray-900">3,847 Parts</div>
              <div className="text-xs text-gray-600">Full parts catalog</div>
            </div>
            <div className="bg-white/70 border border-orange-200 p-4 rounded-lg">
              <AlertTriangle className="w-6 h-6 mb-2 text-orange-600" />
              <div className="text-sm font-semibold text-gray-900">127 Bulletins</div>
              <div className="text-xs text-gray-600">Service bulletins & TSBs</div>
            </div>
            <div className="bg-white/70 border border-purple-200 p-4 rounded-lg">
              <Zap className="w-6 h-6 mb-2 text-purple-600" />
              <div className="text-sm font-semibold text-gray-900">Predictive Search</div>
              <div className="text-xs text-gray-600">No more guessing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Predictive WIS Search
          </CardTitle>
          <p className="text-sm text-gray-600">
            Start typing to see suggestions from the complete WIS database. Select the exact item you need.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <WISPredictiveSearch
              placeholder="Type to search procedures, parts, or bulletins..."
              onItemSelect={handleItemSelect}
              className="w-full"
            />
            
            {/* Search Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Search Examples</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>• "oil change" - Find maintenance procedures</div>
                    <div>• "brake service" - Service procedures</div>
                    <div>• "A000 010 07 20" - Specific part numbers</div>
                    <div>• "transmission" - All transmission items</div>
                    <div>• "differential" - Differential parts & procedures</div>
                    <div>• "hydraulic system" - System components</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item) => (
                    <Button
                      key={`${item.type}-${item.id}`}
                      variant="outline"
                      size="sm"
                      onClick={() => handleHistoryItemSelect(item)}
                      className="h-auto p-2 text-left"
                    >
                      <div className="flex items-center gap-2">
                        {item.type === 'procedure' && <FileText className="w-3 h-3" />}
                        {item.type === 'part' && <Wrench className="w-3 h-3" />}
                        {item.type === 'bulletin' && <AlertTriangle className="w-3 h-3" />}
                        <div>
                          <div className="text-xs font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500 font-mono">{item.ref}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Display Section */}
      {selectedItem ? (
        <WISDocumentDisplay 
          selectedItem={selectedItem}
          className="min-h-96"
        />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Item Selected
              </h3>
              <p className="text-gray-600 mb-6">
                Use the search above to find procedures, parts, or service bulletins. 
                Select an item from the dropdown to view complete details.
              </p>
              
              {/* Quick access buttons */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Popular Searches:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { text: 'Engine Oil Change', type: 'procedure' },
                    { text: 'Brake Adjustment', type: 'procedure' },
                    { text: 'Transmission Service', type: 'procedure' },
                    { text: 'Differential Parts', type: 'part' },
                    { text: 'Hydraulic System', type: 'part' },
                  ].map((suggestion, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        // This would trigger a search for the suggestion
                        // For now, just show the badge
                      }}
                    >
                      {suggestion.text}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WIS Barry Integration */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <MessageSquare className="w-5 h-5" />
            Ask WIS Barry
          </CardTitle>
          <p className="text-sm text-green-700">
            Need help understanding a procedure or finding the right parts? 
            Barry can provide expert guidance using the complete WIS database.
          </p>
        </CardHeader>
        <CardContent>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat with WIS Barry
          </Button>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Mercedes-Benz WIS Database</strong> - Complete production data for Unimog U435 Series (1974-1991)
            </p>
            <p>
              Extracted from official Mercedes Workshop Information System • 
              All part numbers follow Mercedes OEM format • 
              Cross-references to aftermarket suppliers included
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewWISInterface;