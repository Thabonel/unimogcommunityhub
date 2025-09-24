import React, { useState, useEffect } from 'react';
import { Book, Search, Filter, ChevronDown, ChevronRight, FileText, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ManualReference {
  manual: string;
  page: number;
  section: string;
  confidence: number;
  context: string;
}

interface ManualSection {
  id: string;
  title: string;
  pages: number[];
  subsections?: ManualSection[];
  isExpanded?: boolean;
}

interface ManualNavigatorProps {
  currentReference: ManualReference | null;
  onReferenceSelect: (reference: ManualReference) => void;
  userModel?: string;
}

export function ManualNavigator({ currentReference, onReferenceSelect, userModel }: ManualNavigatorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [manualSections, setManualSections] = useState<ManualSection[]>([]);
  const [recentReferences, setRecentReferences] = useState<ManualReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock manual sections data (in real implementation, this would come from the database)
  useEffect(() => {
    const mockSections: ManualSection[] = [
      {
        id: 'general',
        title: 'General Information',
        pages: [1, 2, 3, 4, 5],
        subsections: [
          { id: 'specs', title: 'Technical Specifications', pages: [6, 7, 8, 9, 10] },
          { id: 'safety', title: 'Safety Instructions', pages: [11, 12, 13, 14] }
        ]
      },
      {
        id: 'engine',
        title: 'Engine Systems',
        pages: [15, 16, 17, 18, 19, 20, 21, 22],
        subsections: [
          { id: 'engine-diag', title: 'Engine Diagnostics', pages: [23, 24, 25, 26] },
          { id: 'fuel', title: 'Fuel System', pages: [27, 28, 29, 30, 31] },
          { id: 'cooling', title: 'Cooling System', pages: [32, 33, 34, 35] }
        ]
      },
      {
        id: 'brakes',
        title: 'Brake Systems',
        pages: [36, 37, 38, 39, 40, 41, 42],
        subsections: [
          { id: 'brake-diag', title: 'Brake Diagnostics', pages: [43, 44, 45, 46] },
          { id: 'brake-service', title: 'Service Procedures', pages: [47, 48, 49, 50] },
          { id: 'abs', title: 'ABS System', pages: [51, 52, 53] }
        ]
      },
      {
        id: 'transmission',
        title: 'Transmission',
        pages: [54, 55, 56, 57, 58, 59],
        subsections: [
          { id: 'manual-trans', title: 'Manual Transmission', pages: [60, 61, 62, 63] },
          { id: 'auto-trans', title: 'Automatic Transmission', pages: [64, 65, 66, 67] },
          { id: 'transfer-case', title: 'Transfer Case', pages: [68, 69, 70] }
        ]
      },
      {
        id: 'hydraulics',
        title: 'Hydraulic Systems',
        pages: [71, 72, 73, 74, 75, 76, 77],
        subsections: [
          { id: 'pto', title: 'Power Take-Off', pages: [78, 79, 80, 81] },
          { id: 'hydraulic-pump', title: 'Hydraulic Pump', pages: [82, 83, 84, 85] },
          { id: 'implements', title: 'Implement Controls', pages: [86, 87, 88, 89] }
        ]
      },
      {
        id: 'electrical',
        title: 'Electrical Systems',
        pages: [90, 91, 92, 93, 94],
        subsections: [
          { id: 'wiring', title: 'Wiring Diagrams', pages: [95, 96, 97, 98, 99] },
          { id: 'lighting', title: 'Lighting Systems', pages: [100, 101, 102] },
          { id: 'instruments', title: 'Instruments & Gauges', pages: [103, 104, 105] }
        ]
      }
    ];

    setManualSections(mockSections);
  }, []);

  // Add current reference to recent references
  useEffect(() => {
    if (currentReference) {
      setRecentReferences(prev => {
        const filtered = prev.filter(ref =>
          !(ref.page === currentReference.page && ref.manual === currentReference.manual)
        );
        return [currentReference, ...filtered].slice(0, 5);
      });
    }
  }, [currentReference]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const selectPage = (page: number, sectionTitle: string) => {
    const reference: ManualReference = {
      manual: `${userModel || 'U1700L'} U435 Workshop Manual Volume 1`,
      page,
      section: sectionTitle,
      confidence: 0.95,
      context: `Navigated to ${sectionTitle}, Page ${page}`
    };
    onReferenceSelect(reference);
  };

  const filteredSections = manualSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.subsections?.some(sub =>
      sub.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderSection = (section: ManualSection, isSubsection = false) => {
    const isExpanded = expandedSections.has(section.id);
    const hasSubsections = section.subsections && section.subsections.length > 0;

    return (
      <div key={section.id} className={cn(isSubsection ? "ml-4" : "")}>
        <div
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg hover:bg-military-green/10 cursor-pointer",
            "transition-colors duration-200"
          )}
          onClick={() => hasSubsections ? toggleSection(section.id) : selectPage(section.pages[0], section.title)}
        >
          {hasSubsections && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-400" />
              )}
            </div>
          )}

          <div className={cn(
            "w-4 h-4 flex items-center justify-center",
            isSubsection ? "ml-2" : ""
          )}>
            {isSubsection ? (
              <FileText className="h-3 w-3 text-military-green" />
            ) : (
              <Book className="h-3 w-3 text-military-green" />
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-white">{section.title}</div>
            <div className="text-xs text-gray-400">
              {section.pages.length} pages ({section.pages[0]}-{section.pages[section.pages.length - 1]})
            </div>
          </div>

          {/* Current page indicator */}
          {currentReference && section.pages.includes(currentReference.page) && (
            <div className="w-2 h-2 bg-military-green rounded-full"></div>
          )}
        </div>

        {/* Subsections */}
        {hasSubsections && isExpanded && (
          <div className="mt-2 space-y-1">
            {section.subsections!.map(subsection => renderSection(subsection, true))}
          </div>
        )}

        {/* Pages (for sections without subsections) */}
        {!hasSubsections && isExpanded && (
          <div className="mt-2 ml-6 grid grid-cols-6 gap-1">
            {section.pages.map(page => (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                onClick={() => selectPage(page, section.title)}
                className={cn(
                  "h-7 w-7 p-0 text-xs text-gray-300 hover:bg-military-green/20",
                  currentReference?.page === page ? "bg-military-green/30 text-white" : ""
                )}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-military-green/30 bg-military-green/10">
        <h3 className="font-bold text-sm text-white mb-3">Manual Navigator</h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sections..."
            className="pl-8 h-8 text-xs bg-gray-800 border-military-green/30 text-white"
          />
        </div>

        {/* Model Badge */}
        <Badge variant="outline" className="text-xs">
          {userModel || 'U1700L'} Manual
        </Badge>
      </div>

      {/* Recent References */}
      {recentReferences.length > 0 && (
        <div className="p-3 border-b border-military-green/20">
          <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
            <Star className="h-3 w-3" />
            Recent
          </div>
          <div className="space-y-1">
            {recentReferences.map((ref, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-military-green/10"
                onClick={() => onReferenceSelect(ref)}
              >
                <div className="w-2 h-2 bg-military-green rounded-full"></div>
                <span className="text-xs text-gray-300 flex-1">Page {ref.page}</span>
                <span className="text-xs text-gray-400">{ref.section}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Sections */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-military-green border-t-transparent rounded-full"></div>
            </div>
          ) : (
            filteredSections.map(section => renderSection(section))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-military-green/30 bg-military-green/5">
        <div className="text-xs text-gray-400 text-center">
          {manualSections.reduce((acc, section) =>
            acc + section.pages.length + (section.subsections?.reduce((subAcc, sub) =>
              subAcc + sub.pages.length, 0) || 0), 0
          )} total pages
        </div>
      </div>
    </div>
  );
}