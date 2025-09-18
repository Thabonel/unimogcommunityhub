// WISMobileInterface - Stub component for Phase 2 implementation
import React from 'react';

interface WISMobileInterfaceProps {
  className?: string;
  initialModel?: string;
  initialProcedure?: string;
}

export const WISMobileInterface: React.FC<WISMobileInterfaceProps> = ({
  className,
  initialModel,
  initialProcedure,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8">
          <div className="text-lg font-semibold mb-2">Mobile WIS Interface</div>
          <div className="text-sm text-gray-600">Optimized mobile interface coming in Phase 2</div>
          <div className="text-xs text-gray-400 mt-2">
            Model: {initialModel || 'None'} | Procedure: {initialProcedure || 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};