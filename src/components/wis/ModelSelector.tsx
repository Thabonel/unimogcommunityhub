import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { WISModel, WIS_MODELS } from '@/lib/supabase-wis';

interface ModelSelectorProps {
  selectedModel: WISModel;
  onModelChange: (model: WISModel) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-blue-900">
          <Settings className="w-5 h-5" />
          Select Your Vehicle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {WIS_MODELS.map((model) => (
          <div
            key={model.code}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedModel.code === model.code
                ? 'border-green-400 bg-green-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
            }`}
            onClick={() => onModelChange(model)}
          >
            <div className="flex flex-col">
              <span className={`font-semibold ${
                selectedModel.code === model.code ? 'text-green-900' : 'text-gray-900'
              }`}>
                {model.name} {model.flag}
              </span>
              {model.subtitle && (
                <span className={`text-sm ${
                  selectedModel.code === model.code ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {model.subtitle}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {selectedModel && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
            <Badge className="bg-green-100 text-green-800 mb-2">
              ✓ Filtering content for: {selectedModel.name}
            </Badge>
            <p className="text-xs text-gray-600">
              All procedures, parts, and bulletins are now filtered
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}