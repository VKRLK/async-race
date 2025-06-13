//CarTrack.tsx

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

type Props = {
  car: CarType;
};

const CarTrack = ({ car }: Props) => {
  const dispatch = useAppDispatch();
  const carRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const resetVersion = useSelector(selectResetVersion);

  // Car movement animation
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

  // Car reset effect
  useEffect(() => {
    if (!carRef.current) return;
    carRef.current.style.transition = 'none';
    carRef.current.style.transform = 'translateX(0)';
  }, [resetVersion]);

  // Dispatch finish time when car finishes driving
  useEffect(() => {
    const el = carRef.current;
    if (!el) return;

    const handleTransitionEnd = () => {
      if (car.status === 'drive') {
        const finishTime = Date.now();
        dispatch(setFinishTime({ id: car.id, finishTime }));
      }
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [car.id, car.status, dispatch]);

  const handleDelete = () => {
    dispatch(deleteCarThunk(car.id));
  };

  const handleReset = async () => {
    try {
      await stopEngine(car.id);
      dispatch(updateCarStatus({ id: car.id, status: 'stopped' }));
    } catch (err) {
      console.warn(`Stop failed for car ${car.id}:`, err);
    }

    if (carRef.current) {
      carRef.current.style.transition = 'none';
      carRef.current.style.transform = 'translateX(0)';
    }

    dispatch(updateCarPosition({ id: car.id, positionX: 0 }));
  };

  const handleStart = () => {
    dispatch(startSingleCarThunk(car.id));
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

      <span style={{ color: car.color, marginRight: '1rem' }}>({car.status})</span>

      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', width: '80vw' }}>
        <div
          ref={carRef}
          style={{
            width: '50px',
            height: '30px',
            backgroundColor: car.color,
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={handleReset}>Reset</button>
        <button
          onClick={handleStart}
          disabled={car.status !== 'stopped'}
          style={{ marginLeft: '0.5rem' }}
        >
          Start
        </button>
      </div>
    </li>
  );
};

export default CarTrack;
