// src/app/actions/games.ts
'use server';

import { games as mockGames } from '@/lib/data';
import type { Game } from '@/lib/types';

/**
 * Fetches the list of all available games.
 * Currently returns mock data.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(): Promise<Game[]> {
  // In a real app, you would fetch this from your API
  // For now, we fall back to mock data.
  console.log("Fetching games... (from mock data)");
  return mockGames;
}
