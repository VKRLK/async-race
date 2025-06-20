// src/components/RaceControlPanel/RaceControlPanel.tsx

import { useAppDispatch } from '../../store/hooks';
import { createRandomCars, startRaceThunk, resetRaceThunk } from '../../store/garage/actions';
import type { CarType } from '../../store/garage/types';

type Props = {
  paginatedCars: CarType[];
  trackWidth: number;
};

const RaceControlPanel = ({ paginatedCars, trackWidth }: Props) => {
  const dispatch = useAppDispatch();

  const handleStartAll = () => {
    dispatch(startRaceThunk({ cars: paginatedCars, trackWidth }));
  };

  const handleResetAll = () => {
    dispatch(resetRaceThunk());
  };

  const handleGenerate = () => {
    dispatch(createRandomCars());
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleStartAll} disabled={paginatedCars.length === 0}>
          Start All
        </button>
        <button onClick={handleResetAll} disabled={paginatedCars.length === 0}>
          Reset All
        </button>
        <button onClick={handleGenerate}>Generate 100 Cars</button>
      </div>
    </div>
  );
};

export default RaceControlPanel;
