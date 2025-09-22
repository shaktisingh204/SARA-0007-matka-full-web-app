
'use server';

import { games as mockGames } from '@/lib/data';
import type { Game } from '@/lib/types';
import { revalidatePath } from 'next/cache';

/**
 * Fetches the list of all available games from the API.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(): Promise<Game[]> {
  const API_BASE_URL = process.env.API_BASE_URL;
  if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not set.');
    return mockGames; // Fallback to mock data
  }

  // Fallback for restricted development environment
  if (API_BASE_URL.startsWith('https://gurumatka.matkadash.in')) {
    console.log('Using mock games response due to network restrictions.');
    return mockGames;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/main_game_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': 'mock-user-token' 
      },
      body: JSON.stringify({ string: " " }),
      next: {
        tags: ['games'],
        revalidate: 3600 // Revalidate every hour
      }
    });

    if (!response.ok) {
      console.error(`API call failed with status: ${response.status}`);
      return mockGames; // Fallback to mock data
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
        const games: Game[] = data.data.map((apiGame: any) => ({
          id: apiGame.id.toString(),
          name: apiGame.name,
          openTime: apiGame.open_time,
          closeTime: apiGame.close_time,
        }));
        revalidatePath('/dashboard');
        return games;
    }
     
    return mockGames; // Fallback if data format is unexpected
    
  } catch (e) {
    console.error("Failed to fetch games from API:", e);
    return mockGames;
  }
}
