
import React from "react";

interface FileConversionStatusProps {
  isConverting: boolean;
}

export function FileConversionStatus({ isConverting }: FileConversionStatusProps) {
  if (!isConverting) return null;
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm font-medium ml-3">Converting document...</p>
    </div>
  );
}
