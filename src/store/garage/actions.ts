// src/store/garage/actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCars,
  startEngine,
  drive,
  stopEngine,
  createCar as apiCreateCar,
  updateCar as apiUpdateCar,
  deleteCar as apiDeleteCar,
} from '../../api/api';
import {
  START_ANIMATION,
  STOP_ANIMATION,
  setCarStatus,
  startRace,
  updateCarPosition,
  updateCarStatus,
  resetRace,
  setCurrentPage,
} from './reducer';
import { setStartTime, setFinishTime } from '../winners/reducer';
import type { CarType } from './types';
import type { AppDispatch, RootState } from '../index';
import { saveWinnerResult } from '../winners/actions';
import { CARS_PER_PAGE } from '../../utils/constants';
import type { Car } from '../../api/types';
import { generateRandomCarName, generateRandomColor } from '../../utils/helpers';

export const fetchCars = createAsyncThunk<
  { cars: Car[]; totalCount: number },
  { page: number },
  { state: RootState }
>('garage/fetchCars', async ({ page }) => {
  const { cars, total } = await getCars(page, CARS_PER_PAGE);
  return {
    cars,
    totalCount: total,
  };
});

export const createCar = createAsyncThunk<
  void,
  { name: string; color: string },
  { state: RootState; dispatch: AppDispatch }
>('garage/createCar', async ({ name, color }, { dispatch, getState }) => {
  await apiCreateCar(name, color);

  const { currentPage } = getState().garage;
  await dispatch(fetchCars({ page: currentPage }));
});

export const updateCar = createAsyncThunk(
  'garage/updateCar',
  async ({ id, name, color }: { id: number; name: string; color: string }) => {
    return await apiUpdateCar(id, name, color);
  }
);

export const deleteCarThunk = createAsyncThunk<
  number,
  number,
  { state: RootState; dispatch: AppDispatch }
>('garage/deleteCarThunk', async (carId, { getState, dispatch }) => {
  const { currentPage, cars } = getState().garage;

  await apiDeleteCar(carId);
  const currentPageCars = cars.filter(car => car.id !== carId);

  const isLastCarOnLastPage = currentPage > 1 && currentPageCars.length === 0;
  const nextPage = isLastCarOnLastPage ? currentPage - 1 : currentPage;

  dispatch(setCurrentPage(nextPage));
  await dispatch(fetchCars({ page: nextPage }));

  return carId;
});

//generate 100 random cars
export const createRandomCars = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>('garage/createRandomCars', async (_, { dispatch, getState }) => {
  const cars = Array.from({ length: 100 }, () => ({
    name: generateRandomCarName(),
    color: generateRandomColor(),
  }));

  await Promise.all(cars.map(({ name, color }) => apiCreateCar(name, color)));

  const { currentPage } = getState().garage;
  await dispatch(fetchCars({ page: currentPage }));
});

// Launch the engine and get initial velocity and distance
const runSingleCarLogic = async (carId: number, dispatch: any) => {
  try {
    const startTime = Date.now();
    const { velocity, distance } = await startEngine(carId);

    dispatch(setStartTime({ id: carId, startTime }));
    dispatch(updateCarStatus({ id: carId, status: 'started' }));

    const duration = distance / velocity / 1000;
    const targetX = 1000;

    let driveSuccess = false;

    try {
      const driveResult = await drive(carId);
      dispatch(updateCarStatus({ id: carId, status: 'drive' }));

      if (driveResult.success) {
        driveSuccess = true;
        dispatch(START_ANIMATION({ id: carId, targetX, duration }));
        // Call setFinishTime and saveWinnerResult after the drive is complete
        setTimeout(() => {
          dispatch(setFinishTime({ id: carId, finishTime: Date.now() }));
          dispatch(saveWinnerResult({ id: carId, time: duration * 1000 }));
        }, duration * 1000);
      } else {
        console.warn(`Car ${carId} failed during drive:`, driveResult);
      }
    } catch (error) {}

    if (!driveSuccess) {
      dispatch(STOP_ANIMATION({ id: carId, error: 'Drive failed' }));
      dispatch(updateCarStatus({ id: carId, status: 'stopped' }));
    }
  } catch (error) {
    console.warn(`Failed to start car ${carId}:`, error);
    dispatch(STOP_ANIMATION({ id: carId, error: 'Unexpected error' }));
    dispatch(updateCarStatus({ id: carId, status: 'stopped' }));
  }
};

// 🚘 Thunk для запуска одной машины
export const startSingleCarThunk = createAsyncThunk(
  'garage/startSingleCarThunk',
  async (carId: number, { dispatch }) => {
    await runSingleCarLogic(carId, dispatch);
  }
);

// Start of all cars
export const startRaceThunk = createAsyncThunk(
  'garage/startRaceThunk',
  async (cars: CarType[], { dispatch }) => {
    dispatch(startRace(1));
    await Promise.all(cars.map(car => runSingleCarLogic(car.id, dispatch)));
  }
);

// Reset all cars and their positions
export const resetRaceThunk = createAsyncThunk(
  'garage/resetRaceThunk',
  async (_, { dispatch, getState }) => {
    const { cars } = (getState() as RootState).garage;

    await Promise.all(
      cars.map(async car => {
        try {
          await stopEngine(car.id);
        } catch (err) {
          console.warn(`Failed to stop engine for car ${car.id}`, err);
        }

        dispatch(updateCarPosition({ id: car.id, positionX: 0 }));
        dispatch(setCarStatus({ id: car.id, status: 'stopped' }));
      })
    );

    dispatch(resetRace());
  }
);
