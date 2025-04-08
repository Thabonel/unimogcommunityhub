
import { useState } from 'react';

/**
 * Hook to manage the expanded/collapsed state of sections
 */
export const useSectionExpand = (defaultExpanded: string | null = null) => {
  // Track which section is expanded
  const [expandedSection, setExpandedSection] = useState<string | null>(defaultExpanded);
  
  // Toggle section expand/collapse
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  return {
    expandedSection,
    toggleSection
  };
};

export default useSectionExpand;
