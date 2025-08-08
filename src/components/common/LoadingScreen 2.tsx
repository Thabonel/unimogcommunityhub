
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
    </div>
  );
};

export default LoadingScreen;
