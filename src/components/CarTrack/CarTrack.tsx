//src\components\CarTrack\CarTrack.tsx

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import type { RootState } from '../../store';
import type { CarType } from '../../store/garage/types';
import { startSingleCarThunk } from '../../store/garage/actions';
import { updateCarPosition, updateCarStatus } from '../../store/garage/reducer';
import { selectResetVersion } from '../../store/garage/selectors';
import { setFinishTime } from '../../store/winners/reducer';
import { stopEngine } from '../../api/api';
import { saveWinnerResult } from '../../store/winners/actions';
import { useCarMovement } from './useCarMovement';
import CarTrackControls from './CarTrackControls';
import styles from './CarTrack.module.scss';
import Button from '../Button/Button';
import CarSvg from '../CarSvg/CarSvg';

type Props = {
  car: CarType;
  trackWidth: number;
};

const CarTrack = ({ car, trackWidth }: Props) => {
  const dispatch = useAppDispatch();
  const carRef = useRef<HTMLDivElement>(null);
  const finishLineRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | undefined>(car.status?.startTime);
  const finishLineXRef = useRef<number>(0);
  const resetVersion = useSelector(selectResetVersion);
  const [elapsed, setElapsed] = useState(0);
  const winner = useSelector((state: RootState) => state.winners.winner[car.id]);
  const hasFinishedRef = useRef(false);
  const raceInProgress = useAppSelector(state => state.garage.raceState.status === 'starting');

  useCarMovement(car, carRef, {
    onFinish: () => {
      if (hasFinishedRef.current || car.status?.status !== 'drive') return;

      hasFinishedRef.current = true;

      const finishTime =
        car.status?.startTime && car.duration
          ? car.status.startTime + car.duration * 1000
          : performance.timeOrigin + performance.now();

      dispatch(setFinishTime({ id: car.id, finishTime }));

      if (car.status?.startTime) {
        const raceTime = finishTime - car.status.startTime;
        dispatch(saveWinnerResult({ id: car.id, time: raceTime }));
      }

      dispatch(
        updateCarStatus({
          id: car.id,
          status: {
            ...car.status,
            status: 'stopped',
            finishTime,
            position: car.positionX ?? 0,
          },
        })
      );
    },
  });

  // Time tracking for the car
  useEffect(() => {
    if (car.status?.status !== 'drive' || !car.duration) return;

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

  // Finish line update after track width change
  useEffect(() => {
    const finishEl = finishLineRef.current;
    if (finishEl) {
      const offset = trackWidth * 0.9;
      finishEl.style.left = `${offset}px`;
      finishLineXRef.current = finishEl.getBoundingClientRect().left;
    }
  }, [trackWidth]);

  // Save start time
  useEffect(() => {
    startTimeRef.current = car.status?.startTime;
  }, [car.status?.startTime]);

  // Car position update on status change
  useEffect(() => {
    const el = carRef.current;
    if (!el) return;
    el.style.transition = 'left 0.1s';
    el.style.left = `${car.positionX ?? 0}px`;
  }, [car.positionX, car.status?.status]);

  // Reset car position on resetVersion change
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
      <div className={styles.trackHeader}>
        <div>
          <CarTrackControls car={car} />
        </div>

        <div className={styles.statusOrTime}>
          {car.status?.hasFailed ? (
            <span style={{ color: 'red' }}>Engine failure</span>
          ) : winner?.startTime && winner?.finishTime ? (
            <span style={{ color: car.color }}>
              {((winner.finishTime - winner.startTime) / 1000).toFixed(2)} sec
            </span>
          ) : car.status?.finishTime && car.status?.startTime ? (
            <span style={{ color: car.color }}>
              {((car.status.finishTime - car.status.startTime) / 1000).toFixed(2)} sec
            </span>
          ) : car.status?.status === 'drive' && car.duration !== undefined ? (
            <span style={{ color: car.color }}>{elapsed.toFixed(2)} sec</span>
          ) : null}
        </div>
      </div>

      <div className={styles.secondLine}>
        <div className={styles.buttonWrapper}>
          <Button
            text="Start"
            onClick={() => handleStart()}
            className={styles.startButton}
            disabled={raceInProgress}
          />
          <Button
            text="Reset"
            onClick={() => handleReset()}
            className={styles.resetButton}
            disabled={car.positionX === 0}
          />
        </div>

        <div className={styles.trackWrapper}>
          <div className={styles.roadLine} />
          <div ref={finishLineRef} className={styles.finishLine} />

          <div ref={carRef} className={styles.carBox} data-car-id={car.id}>
            <CarSvg color={car.color} />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CarTrack;
