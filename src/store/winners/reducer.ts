// src/store/winners/reducer.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fetchWinners } from './actions';
import type { WinnerType } from './types';

export type Winner = {
  id: number;
  startTime?: number;
  finishTime?: number;
};

type WinnersState = {
  winner: Record<number, Winner>;
  winnerList: WinnerType[];
  loading: boolean;
  error: string | null;
};

const initialState: WinnersState = {
  winner: {},
  winnerList: [],
  loading: false,
  error: null,
};

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setStartTime: (state, action: PayloadAction<{ id: number; startTime: number }>) => {
      const { id, startTime } = action.payload;
      if (!state.winner[id]) {
        state.winner[id] = { id, startTime };
      } else {
        state.winner[id].startTime = startTime;
      }
    },
    setFinishTime: (state, action: PayloadAction<{ id: number; finishTime: number }>) => {
      const { id, finishTime } = action.payload;
      if (!state.winner[id]) {
        state.winner[id] = { id, finishTime };
      } else {
        state.winner[id].finishTime = finishTime;
      }
    },
    resetWinners: state => {
      state.winner = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWinners.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, action: PayloadAction<WinnerType[]>) => {
        state.loading = false;
        state.winnerList = action.payload;
      })
      .addCase(fetchWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch winners';
      });
  },
});

export const { setStartTime, setFinishTime, resetWinners } = winnersSlice.actions;
export default winnersSlice.reducer;
