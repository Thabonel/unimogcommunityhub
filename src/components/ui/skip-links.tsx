import React from 'react';

/**
 * Skip Links component for accessibility
 * Allows keyboard users to skip to main content
 */
export const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 z-[100] bg-white text-black p-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-0 left-32 z-[100] bg-white text-black p-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to navigation
      </a>
    </div>
  );
};