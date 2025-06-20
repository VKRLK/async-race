// src/components/CarTrack/CarTrack.tsx

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';

import { deleteCarThunk, startSingleCarThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';
import { updateCarPosition, updateCarStatus } from '../../store/garage/reducer';
import { selectResetVersion } from '../../store/garage/selectors';
import { setFinishTime } from '../../store/winners/reducer';
import { stopEngine } from '../../api/api';

import CarEditor from '../CarEditor/CarEditor';
import { saveWinnerResult } from '../../store/winners/actions';

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
  const [isEditing, setIsEditing] = useState(false);
  const resetVersion = useSelector(selectResetVersion);

  // Initialize finish line position based on the track width
  useEffect(() => {
    if (carRef.current) {
      const parentLeft = carRef.current.parentElement?.getBoundingClientRect().left ?? 0;
      finishLineXRef.current = parentLeft + finishLineOffset;
    }
  }, [finishLineOffset]);

  // Set the start time when the car status changes to 'drive'
  useEffect(() => {
    startTimeRef.current = car.status?.startTime;
  }, [car.status?.startTime]);

  // Check position and finish line crossing

  //old
  useEffect(() => {
    let animationFrameId: number;
    let hasFinished = false;

    const trackPosition = () => {
      if (carRef.current) {
        const x = carRef.current.getBoundingClientRect().left;
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
      }

      animationFrameId = requestAnimationFrame(trackPosition);
    };

    if (car.status?.status === 'drive') {
      animationFrameId = requestAnimationFrame(trackPosition);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [car.id, car.status?.status, dispatch]);

  // Car position update animation effect
  useEffect(() => {
    if (!carRef.current) return;

    const el = carRef.current;
    const posX = car.positionX ?? 0;
    const targetX = Math.min(posX, window.innerWidth - 100);

    if (posX === 0) {
      el.style.transition = 'none';
      el.style.transform = 'translateX(0px)';
      void el.offsetWidth;
      el.style.transition = '';
    } else {
      el.style.transition = car.duration ? `transform ${car.duration}s linear` : 'none';
      el.style.transform = `translateX(${targetX}px)`;
    }
  }, [car.positionX, car.duration]);

  // Reset car position and style when resetVersion changes
  useEffect(() => {
    if (!carRef.current) return;
    carRef.current.style.transition = 'none';
    carRef.current.style.transform = 'translateX(0)';
  }, [resetVersion]);

  const handleDelete = () => {
    dispatch(deleteCarThunk(car.id));
  };

  const handleReset = async () => {
    try {
      await stopEngine(car.id);
      dispatch(updateCarStatus({ id: car.id, status: { status: 'stopped' } }));
    } catch (err) {
      console.warn(`Stop failed for car ${car.id}:`, err);
    }

    if (carRef.current) {
      carRef.current.style.transition = 'none';
      carRef.current.style.transform = 'translateX(0)';
    }

    dispatch(updateCarPosition({ id: car.id, position: 0 }));
  };

  const handleStart = () => {
    dispatch(startSingleCarThunk({ carId: car.id, trackWidth }));
  };

  return (
    <li style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        {isEditing ? (
          <CarEditor
            mode="edit"
            carId={car.id}
            initialName={car.name}
            initialColor={car.color}
            onCancelEdit={() => setIsEditing(false)}
          />
        ) : (
          <>
            <span style={{ color: car.color, marginRight: '1rem' }}>{car.id}</span>
            <span style={{ color: car.color, marginRight: '1rem' }}>{car.name}</span>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>

      <span style={{ color: car.color, marginRight: '1rem' }}>({car.status?.status})</span>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          width: '80vw',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${finishLineOffset}px`,
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'red',
            zIndex: 1,
          }}
        />
        <div
          ref={carRef}
          style={{
            width: '50px',
            height: '30px',
            backgroundColor: car.color,
            borderRadius: '4px',
            zIndex: 2,
          }}
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={handleReset}>Reset</button>
        <button
          onClick={handleStart}
          disabled={car.status?.status !== 'stopped'}
          style={{ marginLeft: '0.5rem' }}
        >
          Start
        </button>
      </div>
    </li>
  );
};

export default CarTrack;
