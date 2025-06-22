// src/utils/useTrackResizeObserver.ts

import { useEffect, useRef } from 'react';

export const useTrackResizeObserver = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onResizeDone: (newWidth: number, oldWidth: number) => void,
  delay = 300
) => {
  const prevWidthRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const newWidth = entries[0].contentRect.width;
      const oldWidth = prevWidthRef.current ?? newWidth;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        onResizeDone(newWidth, oldWidth);
        prevWidthRef.current = newWidth;
      }, delay);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ref, onResizeDone, delay]);
};
