// src/components/CarTrack/CarTrackControls.tsx

import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { deleteCarThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';

import CarEditor from '../CarEditor/CarEditor';
import styles from './CarTrack.module.scss';

interface Props {
  car: CarType;
}

const CarTrackControls = ({ car }: Props) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    dispatch(deleteCarThunk(car.id));
  };

  if (isEditing) {
    return (
      <CarEditor
        mode="edit"
        carId={car.id}
        initialName={car.name}
        initialColor={car.color}
        onCancelEdit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <span className={styles.carId} style={{ color: car.color }}>
        {car.id}
      </span>
      <span className={styles.carName} style={{ color: car.color }}>
        {car.name}
      </span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </>
  );
};

export default CarTrackControls;
