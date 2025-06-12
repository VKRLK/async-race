// src/components/CarEditor/CarEditor.tsx

import { useState, useEffect } from 'react';

import { useAppDispatch } from '../../store/hooks';
import { createCar, updateCar } from '../../store/garage/actions';

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
    <div style={{ marginBottom: '1rem' }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Car name" />
      <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      <button onClick={handleSubmit}>{mode === 'edit' ? 'Finish' : 'Create'}</button>
      {mode === 'edit' && onCancelEdit && <button onClick={onCancelEdit}>Cancel</button>}
    </div>
  );
};

export default CarEditor;
