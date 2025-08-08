
import { useState } from 'react';

interface UsePdfViewerStateProps {
  initialContinuousMode?: boolean;
  initialScale?: number;
}

export const usePdfViewerState = (props: UsePdfViewerStateProps = {}) => {
  const {
    initialContinuousMode = false, // Changed to false - single page mode by default
    initialScale = 1.2
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(initialScale);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuousMode, setIsContinuousMode] = useState(initialContinuousMode);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);

  // Handle zoom with limits
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  // Toggle view mode with explicit mode setting
  const handleToggleViewMode = () => {
    setIsContinuousMode(prev => !prev);
  };

  // Reset to page 1 when switching documents
  const resetView = () => {
    setCurrentPage(1);
    setScale(initialScale);
  };

  return {
    currentPage,
    setCurrentPage,
    numPages,
    setNumPages,
    scale,
    setScale,
    isLoading,
    setIsLoading,
    isContinuousMode,
    setIsContinuousMode,
    error,
    setError,
    pdfDoc,
    setPdfDoc,
    handleZoomIn,
    handleZoomOut,
    handleToggleViewMode,
    resetView,
  };
};
