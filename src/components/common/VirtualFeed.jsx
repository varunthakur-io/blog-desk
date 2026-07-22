import React, { useState, useEffect, useRef } from 'react';

/**
 * Reusable individual wrapper for virtualized items.
 * Uses IntersectionObserver to mount/unmount content when near viewport,
 * and ResizeObserver to track dynamic heights of children.
 */
const VirtualItem = ({ children, estimateHeight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(estimateHeight);
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Detect when element is close to viewport (with 600px buffer above and below)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '600px 0px 600px 0px',
      },
    );

    intersectionObserver.observe(element);

    let resizeObserver;
    if (window.ResizeObserver && isVisible) {
      // Keep height cache in sync with real-time renders (likes, font updates, images loading)
      resizeObserver = new ResizeObserver(() => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.height > 0) {
            setHeight(rect.height);
          }
        }
      });
      resizeObserver.observe(element);
    }

    return () => {
      intersectionObserver.unobserve(element);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: isVisible ? 'auto' : `${height}px`,
      }}
    >
      {isVisible ? children : <div style={{ height: `${height}px` }} />}
    </div>
  );
};

/**
 * FlatList-like Virtual Scroll Feed component.
 * Flat DOM size, fast rendering, zero extra dependencies.
 */
export const VirtualFeed = ({
  items,
  renderItem,
  keyExtractor,
  estimateHeight = 350,
  className,
}) => {
  return (
    <div className={className}>
      {items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index;
        return (
          <VirtualItem key={key} estimateHeight={estimateHeight}>
            {renderItem(item, index)}
          </VirtualItem>
        );
      })}
    </div>
  );
};

export default VirtualFeed;
