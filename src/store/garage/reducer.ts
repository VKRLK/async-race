// src/store/garage/reducer.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CarStatus, GarageState } from './types';
import { fetchCars, createCar, updateCar, deleteCarThunk } from './actions';

const initialState: GarageState = {
  cars: [],
  total: 0,
  currentPage: 1,
  raceState: {
    status: 'idle',
    page: null,
  },
  editingCar: null,
  resetVersion: 0,
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setEditingCar(state, action: PayloadAction<GarageState['editingCar']>) {
      state.editingCar = action.payload;
    },
    clearEditingCar(state) {
      state.editingCar = null;
    },

    updateCarPosition(state, action: PayloadAction<{ id: number; positionX: number }>) {
      const { id, positionX } = action.payload;
      const idx = state.cars.findIndex(car => car.id === id);
      if (idx !== -1) {
        state.cars[idx] = {
          ...state.cars[idx],
          positionX,
        };
      }
    },

    setCarStatus(
      state,
      action: PayloadAction<{ id: number; status: 'started' | 'stopped' | 'drive' }>
    ) {
      const car = state.cars.find(c => c.id === action.payload.id);
      if (car) {
        car.status = action.payload.status;
      }
    },

    updateCarStatus(state, action: PayloadAction<{ id: number; status: CarStatus }>) {
      const car = state.cars.find(c => c.id === action.payload.id);
      if (car) {
        car.status = action.payload.status;
      }
    },

    startRace(state, action: PayloadAction<number>) {
      state.raceState.status = 'starting';
      state.raceState.page = action.payload;
    },

    resetRace(state) {
      state.raceState.status = 'resetting';
      state.raceState.page = null;
      state.resetVersion += 1;
      state.cars.forEach(car => {
        car.positionX = 0;
        car.status = 'stopped';
      });
    },

    START_ANIMATION(
      state,
      action: PayloadAction<{ id: number; targetX: number; duration: number }>
    ) {
      const car = state.cars.find(c => c.id === action.payload.id);
      if (car) {
        car.positionX = action.payload.targetX;
        car.duration = action.payload.duration;
      }
    },
    STOP_ANIMATION(
      state,
      action: PayloadAction<{
        id: number;
        error: string;
        startTime?: number;
        duration?: number;
      }>
    ) {
      const car = state.cars.find(c => c.id === action.payload.id);
      if (!car) return;

      const { startTime, duration } = action.payload;
      if (startTime != null && duration != null) {
        const elapsedMs = Date.now() - startTime;
        const ratio = Math.min(elapsedMs / (duration * 1000), 1);
        car.positionX = Math.round((car.positionX ?? 0) * ratio);
      }

      delete car.duration;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload.cars.map(car => ({
          ...car,
          positionX: 0,
          status: 'stopped',
        }));
        state.total = action.payload.totalCount;
      })
      .addCase(createCar.fulfilled, state => {
        state.total++;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const idx = state.cars.findIndex(car => car.id === action.payload.id);
        if (idx !== -1) state.cars[idx] = action.payload;
        state.editingCar = null;
      })
      .addCase(deleteCarThunk.fulfilled, (state, action) => {
        state.total--;
        state.cars = state.cars.filter(car => car.id !== action.payload);
      });
  },
});

export const {
  setEditingCar,
  clearEditingCar,
  updateCarPosition,
  startRace,
  resetRace,
  START_ANIMATION,
  STOP_ANIMATION,
  updateCarStatus,
  setCarStatus,
  setCurrentPage,
} = garageSlice.actions;

export default garageSlice.reducer;
