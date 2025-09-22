
'use server';

import type { Game } from '@/lib/types';
import { games as mockGames } from '@/lib/data';
import { cookies } from 'next/headers';
import { useAuthStore } from '@/lib/store';

type ApiResult = {
  success: boolean;
  data?: Game[];
  error?: string;
}

/**
 * Fetches the list of all available games from the API.
 * @returns A promise that resolves to an object with success status and data or error.
 */
export async function getGames(): Promise<ApiResult> {
  const API_BASE_URL = process.env.API_BASE_URL;

  if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not set.');
    return { success: false, error: 'API endpoint is not configured.' };
  }

  // Fallback for restricted development environment
  if (API_BASE_URL.startsWith('https://gurumatka.matkadash.in')) {
    console.log('Using mock games response due to network restrictions.');
    return { success: true, data: mockGames };
  }
  
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth-storage');
  
  if (!authCookie) {
    return { success: false, error: 'User not authenticated.' };
  }

  const { state } = JSON.parse(authCookie.value);
  const token = state.token;

  if (!token) {
    return { success: false, error: 'Authentication token not found.' };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/main_game_list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': token
      },
      // The API expects a body, even if it's empty
      body: new URLSearchParams({ string: " " }),
    });

    const data = await response.json();

    if (response.ok && data && Array.isArray(data.data)) {
        const games: Game[] = data.data.map((apiGame: any) => ({
          id: apiGame.id.toString(),
          name: apiGame.name,
          openTime: apiGame.open_time,
          closeTime: apiGame.close_time,
        }));
        return { success: true, data: games };
    } else {
      return { success: false, error: data.message || 'Failed to fetch games.' };
    }
    
  } catch (e) {
    console.error("Failed to fetch games from API:", e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
