import { useEffect } from 'react';

/**
 * Custom hook to trigger a callback when scrolling near the bottom of the page.
 * @param {Object} options
 * @param {boolean} options.hasMore - Whether more data is available to load.
 * @param {boolean} options.isLoading - Whether a load operation is currently in progress.
 * @param {Function} options.onLoadMore - Callback to trigger when threshold is reached.
 * @param {number} [options.threshold=200] - Distance in pixels from the bottom to trigger load.
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 200,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const { innerHeight } = window;
      const { scrollTop, offsetHeight } = document.documentElement;

      if (innerHeight + scrollTop >= offsetHeight - threshold) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore, threshold]);
};
export default useInfiniteScroll;
