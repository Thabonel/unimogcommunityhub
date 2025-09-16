import React from 'react';

export interface InteractiveElement {
  type: 'procedure' | 'part_number' | 'code' | 'reference' | 'step';
  text: string;
  value: string;
  startIndex: number;
  endIndex: number;
}

export class BarryResponseParser {
  /**
   * Parse Barry's response and identify interactive elements
   */
  static parseInteractiveElements(response: string): InteractiveElement[] {
    const elements: InteractiveElement[] = [];

    // Patterns to identify interactive elements
    const patterns = [
      // Procedure codes like WI123, WI-123, etc.
      {
        regex: /\b(WI[-\s]?\d{2,})\b/gi,
        type: 'procedure' as const
      },
      // Part numbers (various formats)
      {
        regex: /\b([A-Z0-9]{6,}[-]?[A-Z0-9]*)\b/g,
        type: 'part_number' as const,
        validate: (match: string) => {
          // Filter out common words that might match
          const excludeWords = ['UNIMOG', 'ENGINE', 'SYSTEM', 'MANUAL', 'SERVICE'];
          return !excludeWords.includes(match.toUpperCase()) &&
                 /[0-9]/.test(match) && // Must contain at least one number
                 match.length >= 6;
        }
      },
      // Mercedes part codes
      {
        regex: /\b(\d{3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2})\b/g,
        type: 'part_number' as const
      },
      // Step references like "Step 1", "Step 2", etc.
      {
        regex: /\b(Step\s+\d+)\b/gi,
        type: 'step' as const
      },
      // OM engine codes
      {
        regex: /\b(OM\d{3}[A-Z]?)\b/gi,
        type: 'code' as const
      },
      // Manual references
      {
        regex: /\b(Manual\s+[A-Z0-9-]+)\b/gi,
        type: 'reference' as const
      }
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(response)) !== null) {
        const matchText = match[1];

        // Apply validation if provided
        if (pattern.validate && !pattern.validate(matchText)) {
          continue;
        }

        elements.push({
          type: pattern.type,
          text: matchText,
          value: matchText,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
    });

    // Sort by start index to maintain order
    return elements.sort((a, b) => a.startIndex - b.startIndex);
  }

  /**
   * Convert Barry's response into JSX with clickable elements
   */
  static renderInteractiveResponse(
    response: string,
    onElementClick: (element: InteractiveElement) => void
  ): JSX.Element {
    const elements = this.parseInteractiveElements(response);

    if (elements.length === 0) {
      return React.createElement('span', {}, response);
    }

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    elements.forEach((element, index) => {
      // Add text before this element
      if (element.startIndex > lastIndex) {
        parts.push(response.substring(lastIndex, element.startIndex));
      }

      // Add the clickable element
      const elementKey = `interactive-${index}`;
      const elementClass = this.getElementClassName(element.type);

      parts.push(
        React.createElement(
          'button',
          {
            key: elementKey,
            className: elementClass,
            onClick: () => onElementClick(element),
            title: `Click to view details for ${element.text}`
          },
          element.text
        )
      );

      lastIndex = element.endIndex;
    });

    // Add remaining text
    if (lastIndex < response.length) {
      parts.push(response.substring(lastIndex));
    }

    return React.createElement('span', {}, ...parts);
  }

  /**
   * Get CSS classes for different element types
   */
  private static getElementClassName(type: InteractiveElement['type']): string {
    const baseClasses = 'inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs font-medium transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1';

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

  /**
   * Extract actionable items from Barry's response for quick access
   */
  static extractActionableItems(response: string): {
    procedures: string[];
    partNumbers: string[];
    steps: string[];
  } {
    const elements = this.parseInteractiveElements(response);

    return {
      procedures: elements.filter(e => e.type === 'procedure').map(e => e.value),
      partNumbers: elements.filter(e => e.type === 'part_number').map(e => e.value),
      steps: elements.filter(e => e.type === 'step').map(e => e.value)
    };
  }
}