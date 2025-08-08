import { useEffect, useState } from 'react';

/**
 * Hook to detect mobile device and screen size
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        height: window.innerHeight,
      });
      
      // Mobile: < 768px (Tailwind's md breakpoint)
      setIsMobile(width < 768);
      
      // Tablet: 768px - 1024px
      setIsTablet(width >= 768 && width < 1024);
    };

    // Check on mount
    checkDevice();

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 150);
    };

    window.addEventListener('resize', handleResize);
    
    // Also check for orientation change
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkDevice);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenSize,
    isSmallScreen: screenSize.width < 640, // Tailwind's sm breakpoint
    isMediumScreen: screenSize.width >= 640 && screenSize.width < 768,
    isLargeScreen: screenSize.width >= 1024,
  };
}