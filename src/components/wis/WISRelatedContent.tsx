// WISRelatedContent - Stub component for Phase 2 implementation
import React from 'react';

interface WISRelatedContentProps {
  procedureId: string;
  className?: string;
}

export const WISRelatedContent: React.FC<WISRelatedContentProps> = ({
  procedureId,
  className,
}) => {
  return (
    <div className={className}>
      <div className="p-4 text-center text-gray-500">
        <div className="text-sm font-semibold mb-1">Related Content</div>
        <div className="text-xs">Phase 2 Implementation</div>
        <div className="text-xs text-gray-400 mt-1">Procedure: {procedureId}</div>
      </div>
    </div>
  );
};