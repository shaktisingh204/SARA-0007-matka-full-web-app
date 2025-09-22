'use server';

import type { Bid } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

  try {
    // In a real app, you would pass the userId and authentication token.
    // For now, we are just calling the endpoint.
    const response = await fetch(`${API_BASE_URL}/bid_history`, {
      method: 'POST', // Assuming it's a POST request as is common
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${userToken}` // Add auth token if needed
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

    // Assuming the API returns an array of bids in a format that matches or can be mapped to our `Bid` type.
    // This mapping might need adjustment based on the actual API response structure.
    if (data && Array.isArray(data.bids)) { // Assuming bids are in a 'bids' property
        const bids: Bid[] = data.bids.map((apiBid: any) => ({
          id: apiBid.id.toString(),
          userId: apiBid.user_id,
          gameName: apiBid.game_name,
          betType: apiBid.bet_type,
          market: apiBid.market,
          number: apiBid.number,
          amount: parseFloat(apiBid.amount),
          date: apiBid.created_at, // Assuming a date field like 'created_at'
          status: apiBid.status, // Assuming status is 'Win', 'Loss', or 'Pending'
        }));
        return bids;
    }

    return [];
    
  } catch (e) {
    console.error("Failed to fetch bids from API:", e);
    // Return an empty array in case of an error
    return [];
  }
}
