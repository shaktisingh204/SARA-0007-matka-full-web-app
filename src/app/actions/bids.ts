
'use server';

import type { Bid } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { bids as mockBids } from '@/lib/data';
import { cookies } from 'next/headers';

/**
 * Fetches the bid history for a given user from the API.
 *
 * @param userId The ID of the user whose bids to fetch.
 * @returns A promise that resolves to an array of bids.
 */
export async function getBids(userId: string): Promise<Bid[]> {
  const API_BASE_URL = process.env.API_BASE_URL;
  if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not set.');
    return [];
  }
  
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    console.error('Authentication token not found.');
    return [];
  }

  // Fallback for restricted development environment
  if (API_BASE_URL.startsWith('https://gurumatka.matkadash.in')) {
    console.log('Using mock bids response due to network restrictions.');
    return mockBids;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bid_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({ userId: userId }), // Sending userId in the body
      next: {
        tags: ['bids'],
      }
    });

    if (!response.ok) {
      console.error(`API call failed with status: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data && Array.isArray(data.bids)) {
        const bids: Bid[] = data.bids.map((apiBid: any) => ({
          id: apiBid.id.toString(),
          userId: apiBid.user_id,
          gameName: apiBid.game_name,
          betType: apiBid.bet_type,
          market: apiBid.market,
          number: apiBid.number,
          amount: parseFloat(apiBid.amount),
          date: apiBid.created_at,
          status: apiBid.status,
        }));
        return bids;
    }

    return [];
    
  } catch (e) {
    console.error("Failed to fetch bids from API:", e);
    return [];
  }
}
