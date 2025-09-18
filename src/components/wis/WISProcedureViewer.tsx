// WISProcedureViewer - Stub component for Phase 2 implementation
import React from 'react';

interface WISProcedureViewerProps {
  procedureId: string;
  className?: string;
}

export const WISProcedureViewer: React.FC<WISProcedureViewerProps> = ({
  procedureId,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Procedure Viewer</div>
          <div className="text-sm">Implementation coming in Phase 2</div>
          <div className="text-xs text-gray-400 mt-1">Procedure ID: {procedureId}</div>
        </div>
      </div>
    </div>
  );
};