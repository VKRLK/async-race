// src/store/winners/actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';

import type { WinnerType } from './types';
import { getWinners, getWinner, createWinner, updateWinner } from '../../api/api';

export const fetchWinners = createAsyncThunk<WinnerType[], { page: number; limit: number }>(
  'winners/fetchWinners',
  async ({ page, limit }) => {
    return await getWinners(page, limit);
  }
);

export const saveWinnerResult = createAsyncThunk<void, { id: number; time: number }>(
  'winners/saveWinnerResult',
  async ({ id, time }) => {
    const existing = await getWinner(id);
    if (existing) {
      const bestTime = Math.min(existing.time, time);
      await updateWinner(id, existing.wins + 1, bestTime);
    } else {
      await createWinner(id, time);
    }
  }
);
