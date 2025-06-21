//src\components\RaceControlPanel\RaceControlPanel.tsx

import { useAppDispatch } from '../../store/hooks';
import { createRandomCars, startRaceThunk, resetRaceThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';
import { useState } from 'react';

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
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleStartAll} disabled={isRaceInProgress || paginatedCars.length === 0}>
          {isRaceInProgress ? 'Running...' : 'Start All'}
        </button>
        <button onClick={handleResetAll} disabled={isRaceInProgress || paginatedCars.length === 0}>
          Reset All
        </button>
        <button onClick={handleGenerate} disabled={isRaceInProgress}>
          Generate 100 Cars
        </button>
      </div>
    </div>
  );
};

export default RaceControlPanel;
