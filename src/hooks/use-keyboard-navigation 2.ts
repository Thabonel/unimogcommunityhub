import { useEffect, useRef, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  enabled?: boolean;
}

/**
 * Hook for handling keyboard navigation
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        case 'Tab':
          if (onTab) {
            onTab(event);
          }
          break;
      }
    },
    [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
}

/**
 * Hook for managing focus trap within a container
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, enabled = true) {
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current || !enabled) return;

      const focusableElements = containerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    },
    [containerRef, enabled]
  );

  useKeyboardNavigation({
    onTab: handleTabKey,
    enabled,
  });

  // Focus first element when trap is enabled
  useEffect(() => {
    if (enabled && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [enabled, containerRef]);
}

/**
 * Hook for managing roving tabindex pattern
 */
export function useRovingTabindex(
  items: React.RefObject<HTMLElement>[],
  options: { orientation?: 'horizontal' | 'vertical'; loop?: boolean } = {}
) {
  const { orientation = 'vertical', loop = true } = options;
  const currentIndexRef = useRef(0);

  const focusItem = useCallback((index: number) => {
    const item = items[index]?.current;
    if (item) {
      // Update tabindex for all items
      items.forEach((itemRef, i) => {
        if (itemRef.current) {
          itemRef.current.setAttribute('tabindex', i === index ? '0' : '-1');
        }
      });
      item.focus();
      currentIndexRef.current = index;
    }
  }, [items]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const currentIndex = currentIndexRef.current;
      let nextIndex = currentIndex;

      const isNext = orientation === 'vertical' ? event.key === 'ArrowDown' : event.key === 'ArrowRight';
      const isPrev = orientation === 'vertical' ? event.key === 'ArrowUp' : event.key === 'ArrowLeft';

      if (isNext) {
        event.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
          nextIndex = loop ? 0 : items.length - 1;
        }
      } else if (isPrev) {
        event.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? items.length - 1 : 0;
        }
      } else if (event.key === 'Home') {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        nextIndex = items.length - 1;
      }

      if (nextIndex !== currentIndex) {
        focusItem(nextIndex);
      }
    },
    [items, orientation, loop, focusItem]
  );

  // Set up event listeners on each item
  useEffect(() => {
    items.forEach((itemRef, index) => {
      const item = itemRef.current;
      if (item) {
        item.addEventListener('keydown', handleKeyDown);
        item.addEventListener('click', () => focusItem(index));
        
        // Set initial tabindex
        item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      }
    });

    return () => {
      items.forEach((itemRef) => {
        const item = itemRef.current;
        if (item) {
          item.removeEventListener('keydown', handleKeyDown);
        }
      });
    };
  }, [items, handleKeyDown, focusItem]);

  return { focusItem, currentIndex: currentIndexRef.current };
}