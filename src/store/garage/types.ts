//src/store/garage/types.ts

export type CarStatus = {
  status: 'stopped' | 'started' | 'drive';
  isAnimating?: boolean;
  startTime?: number;
  finishTime?: number;
  position?: number;
  hasFailed?: boolean;
};

export type CarType = {
  id: number;
  name: string;
  color: string;
  positionX?: number;
  duration?: number;
  status?: CarStatus;
};

export interface GarageState {
  cars: CarType[];
  total: number;
  currentPage: number;
  editingCar: CarType | null;
  raceState: RaceState;
  resetVersion: number;
}

export type RaceStatus = 'idle' | 'starting' | 'resetting';

export interface RaceState {
  status: RaceStatus;
}
