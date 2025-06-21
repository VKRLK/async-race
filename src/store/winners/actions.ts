// src/store/winners/actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWinners, getWinner, createWinner, updateWinner, getCar } from '../../api/api';
import type { WinnerType } from './types';

export type WinnerDisplay = {
  id: number;
  name: string;
  color: string;
  wins: number;
  time: number;
};

export const fetchWinners = createAsyncThunk<
  WinnerDisplay[],
  { page: number; limit: number; sort?: keyof WinnerType; order?: 'asc' | 'desc' }
>('winners/fetchWinners', async ({ page, limit, sort, order }) => {
  const { winners } = await getWinners(page, limit, sort, order);
  const sanitized = winners.map(winner => {
    const rawTime = winner.time;
    const displayTime = rawTime < 100 ? 999999 : rawTime;

    return { ...winner, time: displayTime };
  });
  const enriched = await Promise.all(
    sanitized.map(async winner => {
      const car = await getCar(winner.id).catch(() => null);
      return {
        id: winner.id,
        name: car?.name ?? 'Unknown',
        color: car?.color ?? '#000',
        wins: winner.wins,
        time: winner.time,
      };
    })
  );

  return enriched;
});

export const saveWinnerResult = createAsyncThunk<void, { id: number; time: number }>(
  'winners/saveWinnerResult',
  async ({ id, time }) => {
    const existing = await getWinner(id);

    if (existing) {
      const bestTime = existing.time < 100 ? time : Math.min(existing.time, time);

      await updateWinner(id, existing.wins + 1, bestTime);
    } else {
      await createWinner(id, time);
    }
  }
);
