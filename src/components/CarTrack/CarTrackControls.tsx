// src/components/CarTrack/CarTrackControls.tsx

import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { deleteCarThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';

import CarEditor from '../CarEditor/CarEditor';
import styles from './CarTrack.module.scss';
import Button from '../Button/Button';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
    <div className={styles.controls}>
      <span className={styles.carId} style={{ color: car.color }}>
        {car.id}
      </span>
      <span className={styles.carName} style={{ color: car.color }}>
        {car.name}
      </span>

      <Button
        icon={<FontAwesomeIcon icon={faEdit} />}
        onClick={() => setIsEditing(true)}
        className={classNames(styles.editButton)}
        color="var(--primary)"
      />

      <Button
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => handleDelete()}
        className={classNames(styles.deleteButton)}
        color="var(--error)"
      />
    </div>
  );
};

export default CarTrackControls;
