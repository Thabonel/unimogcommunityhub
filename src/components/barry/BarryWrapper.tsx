import React from 'react';
import { useLocation } from 'react-router-dom';
import { FloatingBarryButton } from './FloatingBarryButton';

export function BarryWrapper() {
  const location = useLocation();
  
  // Don't show Barry on the homepage
  const shouldShowBarry = location.pathname !== '/';
  
  if (!shouldShowBarry) {
    return null;
  }
  
  return <FloatingBarryButton />;
}