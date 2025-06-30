import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 200
}: UseInfiniteScrollProps) {
  const loadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current || loading || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Check if user has scrolled near the bottom
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadingRef.current = true;
      onLoadMore();
      
      // Reset the loading flag after a short delay
      setTimeout(() => {
        loadingRef.current = false;
      }, 1000);
    }
  }, [hasMore, loading, onLoadMore, threshold]);

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 200);
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll]);

  // Reset loading ref when loading state changes
  useEffect(() => {
    if (!loading) {
      loadingRef.current = false;
    }
  }, [loading]);
}

// Throttle function to limit how often scroll handler is called
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}