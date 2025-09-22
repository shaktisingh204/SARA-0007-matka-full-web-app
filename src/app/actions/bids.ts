'use server';

import type { Bid } from '@/lib/types';
import clientPromise from '@/lib/mongodb';
import type { Collection, Db, MongoClient, WithId } from 'mongodb';

/**
 * Fetches the bid history for a given user from MongoDB.
 *
 * @param userId The ID of the user whose bids to fetch.
 * @returns A promise that resolves to an array of bids.
 */
export async function getBids(userId: string): Promise<Bid[]> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("matka"); // Assumes your database name is "matka"
    const bidsCollection: Collection<Omit<Bid, 'id'>> = db.collection("bids"); // Assumes your collection is named "bids"
    
    // Find all bids associated with the given userId
    const userBidsCursor = bidsCollection.find({ userId: userId });
    const userBidsArray = await userBidsCursor.toArray();

    console.log(`Found ${userBidsArray.length} bids for user ${userId} in MongoDB`);
    
    // Convert MongoDB's _id to a string and return the data
    return userBidsArray.map((bid: WithId<Omit<Bid, 'id'>>) => ({
      ...bid,
      id: bid._id.toString(),
      userId: bid.userId, // Ensure userId is passed through
    })) as Bid[];

  } catch (e) {
    console.error("Failed to fetch bids from MongoDB:", e);
    // Return an empty array in case of an error
    return [];
  }
}
