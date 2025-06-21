// src/components/CarTrack/CarTrack.tsx

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';

import { startSingleCarThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';
import { updateCarPosition, updateCarStatus } from '../../store/garage/reducer';
import { selectResetVersion } from '../../store/garage/selectors';
import { setFinishTime } from '../../store/winners/reducer';
import { stopEngine } from '../../api/api';
import { saveWinnerResult } from '../../store/winners/actions';

import CarTrackControls from './CarTrackControls';
import { useCarMovement } from './useCarMovement';

import styles from './CarTrack.module.scss';

type Props = {
  car: CarType;
  trackWidth: number;
};

const CarTrack = ({ car, trackWidth }: Props) => {
  const dispatch = useAppDispatch();
  const carRef = useRef<HTMLDivElement>(null);
  const finishLineOffset = trackWidth * 0.9;
  const startTimeRef = useRef<number | undefined>(car.status?.startTime);
  const finishLineXRef = useRef<number>(0);
  const resetVersion = useSelector(selectResetVersion);
  const [elapsed, setElapsed] = useState(0);

  // Анимация движения
  useCarMovement(car, carRef);

  useEffect(() => {
    if (car.status?.status !== 'drive' || !car.duration) {
      return;
    }

    const start = performance.now();

    const tick = () => {
      const now = performance.now();
      const seconds = (now - start) / 1000;

      if (car.duration !== undefined) {
        if (seconds >= car.duration) {
          setElapsed(car.duration);
        } else {
          setElapsed(seconds);
          requestAnimationFrame(tick);
        }
      } else {
        setElapsed(0);
      }
    };

    requestAnimationFrame(tick);

    return () => setElapsed(0);
  }, [car.status?.status, car.duration]);

  // Finish line position
  useEffect(() => {
    if (carRef.current) {
      const parentLeft = carRef.current.parentElement?.getBoundingClientRect().left ?? 0;
      finishLineXRef.current = parentLeft + finishLineOffset;
    }
  }, [finishLineOffset]);

  // Set initial start time when car status changes
  useEffect(() => {
    startTimeRef.current = car.status?.startTime;
  }, [car.status?.startTime]);

  // Reset car position when status changes
  useEffect(() => {
    const el = carRef.current;
    if (!el || car.status?.status === 'drive') return;
    el.style.left = `${car.positionX ?? 0}px`;
  }, [car.positionX, car.status?.status]);

  // Finish line tracking and status updates
  useEffect(() => {
    let animationFrameId: number;
    let hasFinished = false;

    const trackPosition = () => {
      const el = carRef.current;
      if (!el) return;

      const x = el.getBoundingClientRect().left;
      dispatch(updateCarPosition({ id: car.id, position: x }));

      if (car.status?.status) {
        dispatch(
          updateCarStatus({
            id: car.id,
            status: {
              status: car.status.status,
              position: x,
              startTime: car.status.startTime,
              finishTime: car.status.finishTime,
            },
          })
        );
      }

      if (!hasFinished && car.status?.status === 'drive' && x >= finishLineXRef.current) {
        hasFinished = true;
        const finishTime = Date.now();
        dispatch(setFinishTime({ id: car.id, finishTime }));

        const start = startTimeRef.current;
        if (start) {
          const raceTime = finishTime - start;
          dispatch(saveWinnerResult({ id: car.id, time: raceTime }));
        }
      }

      animationFrameId = requestAnimationFrame(trackPosition);
    };

    if (car.status?.status === 'drive') {
      animationFrameId = requestAnimationFrame(trackPosition);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [car.id, car.status?.status, dispatch]);

  // Reset car position when resetVersion changes
  useEffect(() => {
    const el = carRef.current;
    if (!el) return;

    el.style.transition = 'none';
    el.style.left = '0px';
  }, [resetVersion]);

  const handleReset = async () => {
    try {
      await stopEngine(car.id);
      dispatch(updateCarStatus({ id: car.id, status: { status: 'stopped' } }));
    } catch (err) {
      console.warn(`Stop failed for car ${car.id}:`, err);
    }

    const el = carRef.current;
    if (el) {
      const computedStyle = window.getComputedStyle(el);
      const left = parseFloat(computedStyle.left || '0');
      el.style.left = `${left}px`;
      el.style.transition = 'none';
      void el.offsetHeight;
    }

    dispatch(updateCarPosition({ id: car.id, position: 0 }));
  };

  const handleStart = () => {
    dispatch(startSingleCarThunk({ carId: car.id, trackWidth }));
  };

  return (
    <li className={styles.carTrack}>
      <div className={styles.topRow}>
        <CarTrackControls car={car} />
      </div>

      <span className={styles.carStatus} style={{ color: car.color }}>
        ({car.status?.status})
      </span>

      {car.status?.hasFailed ? (
        <span style={{ color: 'red' }}>Engine failure</span>
      ) : car.status?.status === 'drive' && car.duration !== undefined ? (
        <span style={{ color: car.color }}>{elapsed.toFixed(2)} sec</span>
      ) : null}

      <div className={styles.trackWrapper}>
        <div className={styles.finishLine} style={{ left: `${finishLineOffset}px` }} />
        <div
          ref={carRef}
          className={styles.carBox}
          style={{ backgroundColor: car.color }}
          data-car-id={car.id}
        />
      </div>

      <div className={styles.buttons}>
        <button onClick={handleReset}>Reset</button>
        <button
          onClick={handleStart}
          disabled={car.status?.status !== 'stopped'}
          className={styles.startButton}
        >
          Start
        </button>
      </div>
    </li>
  );
};

export default CarTrack;
