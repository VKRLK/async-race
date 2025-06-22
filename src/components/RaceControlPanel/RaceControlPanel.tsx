// src/components/RaceControlPanel/RaceControlPanel.tsx

import { useAppDispatch } from '../../store/hooks';
import { createRandomCars, startRaceThunk, resetRaceThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';
import { useState } from 'react';
import Button from '../Button/Button';
import styles from './RaceControlPanel.module.scss';

type Props = {
  paginatedCars: CarType[];
  trackWidth: number;
};

const RaceControlPanel = ({ paginatedCars, trackWidth }: Props) => {
  const dispatch = useAppDispatch();
  const [isRaceInProgress, setRaceInProgress] = useState(false);

  const handleStartAll = async () => {
    if (isRaceInProgress || paginatedCars.length === 0) return;

    setRaceInProgress(true);
    try {
      await dispatch(startRaceThunk({ cars: paginatedCars, trackWidth })).unwrap();
    } catch (err) {
      console.warn('Race failed:', err);
    } finally {
      setRaceInProgress(false);
    }
  };

  const handleResetAll = async () => {
    if (isRaceInProgress) return;

    await dispatch(resetRaceThunk());
  };

  const handleGenerate = () => {
    if (isRaceInProgress) return;

    dispatch(createRandomCars());
  };

  return (
    <div className={styles.panel}>
      <Button
        text={isRaceInProgress ? 'Running...' : 'Start All'}
        onClick={handleStartAll}
        disabled={isRaceInProgress || paginatedCars.length === 0}
      />
      <Button
        text="Reset All"
        onClick={handleResetAll}
        disabled={isRaceInProgress || paginatedCars.length === 0}
        appearance="outline"
      />
      <Button
        text="Generate 100 Cars"
        onClick={handleGenerate}
        disabled={isRaceInProgress}
        variant="primary"
        appearance="outline"
      />
    </div>
  );
};

export default RaceControlPanel;
