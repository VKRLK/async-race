// src\components\CarTrack\useCarMovement.ts

import { useEffect, useRef } from 'react';
import type { CarType } from '../../store/garage/types';

export const useCarMovement = (
  car: Pick<CarType, 'id' | 'positionX' | 'status' | 'duration'>,
  carRef: React.RefObject<HTMLDivElement | null>
) => {
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const el = carRef.current;
    if (!el) return;

    // reset animation frame if it exists
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // if the car is not driving, just set the position
    if (car.status?.status !== 'drive') {
      el.style.left = `${car.positionX ?? 0}px`;
      return;
    }

    const start = performance.now();
    const startX = parseFloat(el.style.left || '0');
    const targetX = car.positionX ?? 0;
    const duration = (car.duration ?? 3) * 1000;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const currentX = startX + (targetX - startX) * progress;

      el.style.left = `${currentX}px`;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [car.id, car.positionX, car.duration, car.status?.status]);
};
