//src/api/api.ts

import { BACKEND_URL } from '../utils/constants';
import type { Car, EngineStartResponse, DriveResponse, Winner } from './types';
import { request } from '../utils/helpers';

// ==== Garage ====
export async function getCar(id: number): Promise<Car> {
  return request<Car>(`${BACKEND_URL}/garage/${id}`);
}

export async function getCars(
  page: number,
  limit: number
): Promise<{ cars: Car[]; total: number }> {
  const res = await fetch(`${BACKEND_URL}/garage?_page=${page}&_limit=${limit}`, {
    cache: 'no-store',
  });
  const cars: Car[] = await res.json();
  const total = Number(res.headers.get('X-Total-Count')) || 0;
  return { cars, total };
}

export async function createCar(name: string, color: string): Promise<Car> {
  return request<Car>(`${BACKEND_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}

export async function updateCar(id: number, name: string, color: string): Promise<Car> {
  return request<Car>(`${BACKEND_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}

export async function deleteCar(id: number): Promise<void> {
  await request(`${BACKEND_URL}/garage/${id}`, { method: 'DELETE' });
}

// ==== Engine ====
export async function startEngine(id: number): Promise<EngineStartResponse> {
  return request<EngineStartResponse>(`${BACKEND_URL}/engine?id=${id}&status=started`, {
    method: 'PATCH',
  });
}

export async function stopEngine(id: number): Promise<void> {
  await request(`${BACKEND_URL}/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  });
}

export async function drive(id: number): Promise<DriveResponse> {
  return request<DriveResponse>(`${BACKEND_URL}/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  });
}

// ==== Winners ====
export async function getWinners(
  page: number,
  limit: number,
  sort?: keyof Winner,
  order: 'asc' | 'desc' = 'asc'
): Promise<{ winners: Winner[]; total: number }> {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
    ...(sort && { _sort: sort }),
    ...(order && { _order: order }),
  });

  const response = await fetch(`${BACKEND_URL}/winners?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch winners: ${response.statusText}`);
  }

  const total = Number(response.headers.get('X-Total-Count')) || 0;
  const winners = await response.json();

  return { winners, total };
}

export async function getWinner(id: number): Promise<Winner | null> {
  try {
    return await request<Winner>(`${BACKEND_URL}/winners/${id}`);
  } catch (error) {
    if (error instanceof Error && 'message' in error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

export async function createWinner(id: number, time: number): Promise<Winner> {
  return request<Winner>(`${BACKEND_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins: 0, time }),
  });
}

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  return request<Winner>(`${BACKEND_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
}
