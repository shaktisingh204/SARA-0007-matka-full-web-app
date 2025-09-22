// src/app/actions/games.ts
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

  try {
    const response = await fetch(`${API_BASE_URL}/main_game_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In a real app, you would get the token from the user's session
        'token': 'mock-user-token' 
      },
      // The API expects a 'string' field, but its purpose isn't clear from the Java code.
      // Sending an empty object or a specific string might be needed.
      // For now, we assume it can be a simple payload.
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

    const data = await reaponse.json();

    // Assuming the API returns an object with a 'data' property which is an array of games.
    // This structure might need to be adjusted based on the actual API response.
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
    // Return mock data in case of an error
    return mockGames;
  }
}
