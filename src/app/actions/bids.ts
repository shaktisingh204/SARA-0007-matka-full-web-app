
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
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    console.error('Authentication token not found.');
    return [];
  }

  try {
    const { default: connectToDatabase } = await import('@/lib/db');
    const { Bid: BidModel } = await import('@/lib/models');

    await connectToDatabase();

    const bidsData = await BidModel.find({ userId }).sort({ createdAt: -1 });

    const bids: Bid[] = bidsData.map((dbBid: any) => ({
      id: dbBid._id.toString(),
      userId: dbBid.userId.toString(),
      gameName: dbBid.gameName,
      betType: dbBid.betType,
      market: dbBid.market,
      number: dbBid.number,
      amount: dbBid.amount,
      date: dbBid.createdAt.toISOString(),
      status: dbBid.status,
    }));

    return bids;
  } catch (e) {
    console.error("Failed to fetch bids from DB:", e);
    return [];
  }
}
