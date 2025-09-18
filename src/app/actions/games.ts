'use server';

import { games } from '@/lib/data';
import type { Game } from '@/lib/types';

/**
 * Fetches the list of all available games.
 * In a real application, this would fetch data from a database.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(): Promise<Game[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would replace this with your database query.
  // For example: const games = await db.collection('games').find().toArray();
  return games;
}
