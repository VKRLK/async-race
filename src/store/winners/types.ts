// src/store/winners/types.ts

export type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerDisplay = {
  id: number;
  name: string;
  color: string;
  wins: number;
  time: number;
};
