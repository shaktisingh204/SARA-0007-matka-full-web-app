
'use server';

import type { Game } from '@/lib/types';
import { games as mockGames } from '@/lib/data';
import { cookies } from 'next/headers';

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
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const { default: connectToDatabase } = await import('@/lib/db');
    const { Game } = await import('@/lib/models');

    await connectToDatabase();

    const gamesData = await Game.find({});

    const games: Game[] = gamesData.map((apiGame: any) => ({
      id: apiGame._id.toString(),
      name: apiGame.name,
      open_time: apiGame.open_time,
      close_time: apiGame.close_time,
    }));

    return { success: true, data: games };
  } catch (e) {
    console.error("Failed to fetch games from DB:", e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
