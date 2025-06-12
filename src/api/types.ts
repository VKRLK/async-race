//api/types.ts

export type Car = {
  id: number;
  name: string;
  color: string;
};

export type EngineStartResponse = {
  velocity: number;
  distance: number;
};

export type DriveResponse = {
  success: boolean;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
};
