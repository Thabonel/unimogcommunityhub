import React from 'react';
import { BarryResponseParser, InteractiveElement } from '@/utils/barry-response-parser';
import { Badge } from '@/components/ui/badge';
import { FileText, Package, Settings, BookOpen } from 'lucide-react';

interface InteractiveBarryResponseProps {
  response: string;
  onElementClick: (element: InteractiveElement) => void;
}

export const InteractiveBarryResponse: React.FC<InteractiveBarryResponseProps> = ({
  response,
  onElementClick
}) => {
  // Parse the response for interactive elements
  const elements = BarryResponseParser.parseInteractiveElements(response);

  // Split response into paragraphs for better formatting
  const paragraphs = response.split('\n\n').filter(p => p.trim());

  const renderInteractiveParagraph = (paragraph: string, paragraphIndex: number) => {
    const paragraphElements = elements.filter(
      element => element.startIndex >= response.indexOf(paragraph) &&
                 element.endIndex <= response.indexOf(paragraph) + paragraph.length
    );

    if (paragraphElements.length === 0) {
      return <span key={paragraphIndex}>{paragraph}</span>;
    }

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const paragraphStart = response.indexOf(paragraph);

    paragraphElements.forEach((element, index) => {
      const relativeStart = element.startIndex - paragraphStart;
      const relativeEnd = element.endIndex - paragraphStart;

      // Add text before this element
      if (relativeStart > lastIndex) {
        parts.push(paragraph.substring(lastIndex, relativeStart));
      }

      // Add the clickable element
      const elementKey = `${paragraphIndex}-interactive-${index}`;
      const Icon = getElementIcon(element.type);

      parts.push(
        <button
          key={elementKey}
          className={getElementClassName(element.type)}
          onClick={() => onElementClick(element)}
          title={`Click to view details for ${element.text}`}
        >
          <Icon className="h-3 w-3" />
          {element.text}
        </button>
      );

      lastIndex = relativeEnd;
    });

    // Add remaining text
    if (lastIndex < paragraph.length) {
      parts.push(paragraph.substring(lastIndex));
    }

    return <span key={paragraphIndex}>{parts}</span>;
  };

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-sm leading-relaxed">
          {renderInteractiveParagraph(paragraph, index)}
        </p>
      ))}

      {/* Quick Access Panel for Interactive Elements */}
      {elements.length > 0 && (
        <div className="mt-6 p-3 bg-military-green/5 border border-military-green/20 rounded-lg">
          <h4 className="text-xs font-medium text-military-green mb-2 uppercase tracking-wide">
            Quick Access
          </h4>
          <div className="space-y-2">
            {elements.filter(e => e.type === 'procedure').length > 0 && (
              <div>
                <span className="text-xs text-gray-600">Procedures:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {elements.filter(e => e.type === 'procedure').map((element, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-blue-50"
                      onClick={() => onElementClick(element)}
                    >
                      <FileText className="h-2 w-2 mr-1" />
                      {element.text}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {elements.filter(e => e.type === 'part_number').length > 0 && (
              <div>
                <span className="text-xs text-gray-600">Parts:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {elements.filter(e => e.type === 'part_number').map((element, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-green-50"
                      onClick={() => onElementClick(element)}
                    >
                      <Package className="h-2 w-2 mr-1" />
                      {element.text}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {elements.filter(e => e.type === 'step').length > 0 && (
              <div>
                <span className="text-xs text-gray-600">Steps:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {elements.filter(e => e.type === 'step').map((element, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-orange-50"
                      onClick={() => onElementClick(element)}
                    >
                      <BookOpen className="h-2 w-2 mr-1" />
                      {element.text}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function getElementIcon(type: InteractiveElement['type']) {
  switch (type) {
    case 'procedure':
      return FileText;
    case 'part_number':
      return Package;
    case 'code':
      return Settings;
    case 'step':
      return BookOpen;
    case 'reference':
      return BookOpen;
    default:
      return FileText;
  }
}

function getElementClassName(type: InteractiveElement['type']): string {
  const baseClasses = 'inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded text-xs font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1';

  switch (type) {
    case 'procedure':
      return `${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 focus:ring-blue-500`;
    case 'part_number':
      return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 focus:ring-green-500`;
    case 'code':
      return `${baseClasses} bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200 focus:ring-purple-500`;
    case 'step':
      return `${baseClasses} bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200 focus:ring-orange-500`;
    case 'reference':
      return `${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 focus:ring-gray-500`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 focus:ring-gray-500`;
  }
}