//src\store\garage\selectors.ts

import type { RootState } from '../index';

export const selectCars = (state: RootState) => state.garage.cars;
export const selectTotalCars = (state: RootState) => state.garage.total;
export const selectEditingCar = (state: RootState) => state.garage.editingCar;
export const selectCurrentPage = (state: RootState) => state.garage.currentPage;
export const selectRaceState = (state: RootState) => state.garage.raceState;
export const selectResetVersion = (state: RootState) => state.garage.resetVersion;
