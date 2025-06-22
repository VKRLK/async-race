// src/components/CarEditor/CarEditor.tsx

import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { createCar, updateCar } from '../../store/garage/actions';
import Button from '../Button/Button';
import styles from './CarEditor.module.scss';

type Props = {
  mode: 'create' | 'edit';
  initialName?: string;
  initialColor?: string;
  carId?: number;
  onCancelEdit?: () => void;
};

const CarEditor = ({
  mode,
  initialName = '',
  initialColor = '#000000',
  carId,
  onCancelEdit,
}: Props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
  }, [initialName, initialColor]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (mode === 'create') {
      dispatch(createCar({ name, color }));
      setName('');
    } else if (mode === 'edit' && carId !== undefined) {
      dispatch(updateCar({ id: carId, name, color }));
      onCancelEdit?.();
    }
  };

  return (
    <div className={styles.carEditor}>
      <input
        className={styles.input}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Car name"
      />
      <input
        type="color"
        className={styles.colorPicker}
        value={color}
        onChange={e => setColor(e.target.value)}
      />
      <Button
        text={mode === 'edit' ? 'Finish' : 'Create'}
        onClick={handleSubmit}
        variant="primary"
      />
      {mode === 'edit' && onCancelEdit && (
        <Button
          text="Cancel"
          onClick={onCancelEdit}
          variant="danger"
          appearance="outline"
          className={styles.cancelButton}
        />
      )}
    </div>
  );
};

export default CarEditor;
