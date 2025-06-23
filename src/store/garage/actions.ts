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
  startRace,
  updateCarStatus,
  resetRace,
  setCurrentPage,
  setStartTime,
  updateCarPosition,
  endRace,
} from './reducer';
import { saveWinnerResult } from '../winners/actions';
import type { CarType } from './types';
import type { AppDispatch, AppThunk, RootState } from '../index';
import { CARS_PER_PAGE, VISUAL_FRAME_OFFSET_MS } from '../../utils/constants';
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

const runSingleCarLogic = async (carId: number, dispatch: AppDispatch, trackWidth: number) => {
  try {
    const { velocity, distance } = await startEngine(carId);
    const startTime = performance.timeOrigin + performance.now();

    dispatch(setStartTime({ id: carId, startTime }));
    dispatch(
      updateCarStatus({
        id: carId,
        status: {
          status: 'drive',
          startTime,
        },
      })
    );

    const targetX = trackWidth * 0.9;
    const duration = distance / velocity / 1000;

    dispatch(START_ANIMATION({ id: carId, targetX, duration }));

    try {
      const driveResult = await drive(carId);
      if (!driveResult.success) throw new Error('Drive failed');

      const finishTime = performance.timeOrigin + performance.now() - VISUAL_FRAME_OFFSET_MS;
      const raceTime = finishTime - startTime;

      dispatch(saveWinnerResult({ id: carId, time: raceTime }));
    } catch {
      const el = document.querySelector(`[data-car-id="${carId}"]`) as HTMLDivElement;
      let left = 0;

      if (el) {
        const computed = window.getComputedStyle(el);
        left = parseFloat(computed.left || '0');
        el.style.transition = 'none';
        el.style.left = `${left}px`;
        void el.offsetHeight;
      }
      dispatch(updateCarPosition({ id: carId, position: left }));

      dispatch(
        updateCarStatus({
          id: carId,
          status: {
            status: 'stopped',
            position: left,
            hasFailed: true,
          },
        })
      );

      dispatch(STOP_ANIMATION({ id: carId, error: 'Drive failed' }));
    }
  } catch {
    dispatch(STOP_ANIMATION({ id: carId, error: 'Unexpected error' }));
    dispatch(updateCarStatus({ id: carId, status: { status: 'stopped', hasFailed: true } }));
  }
};

export const startSingleCarThunk = createAsyncThunk<
  void,
  { carId: number; trackWidth: number },
  { dispatch: AppDispatch; state: RootState }
>('garage/startSingleCarThunk', async ({ carId, trackWidth }, { dispatch }) => {
  await runSingleCarLogic(carId, dispatch, trackWidth);
});

export const startRaceThunk = createAsyncThunk<
  void,
  { cars: CarType[]; trackWidth: number },
  { dispatch: AppDispatch; state: RootState }
>('garage/startRaceThunk', async ({ cars, trackWidth }, { dispatch }) => {
  dispatch(startRace());
  await Promise.all(cars.map(car => runSingleCarLogic(car.id, dispatch, trackWidth)));
  dispatch(endRace());
});

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

        const el = document.querySelector(`[data-car-id="${car.id}"]`) as HTMLDivElement;
        if (el) {
          el.style.transition = 'none';
          el.style.left = '0px';
          void el.offsetHeight;
        }

        dispatch(
          updateCarStatus({
            id: car.id,
            status: { status: 'stopped', position: 0, hasFailed: false },
          })
        );
      })
    );

    dispatch(resetRace());
  }
);

export const recalculatePixelPositionsOnResize =
  (oldWidth: number, newWidth: number): AppThunk =>
  (dispatch, getState) => {
    const scale = newWidth / oldWidth;
    const cars = getState().garage.cars;

    cars.forEach(car => {
      const oldX = car.positionX ?? 0;
      const newX = oldX * scale;
      dispatch(updateCarPosition({ id: car.id, position: newX }));
    });
  };
