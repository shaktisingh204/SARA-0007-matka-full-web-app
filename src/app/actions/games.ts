'use server';

import { games as mockGames } from '@/lib/data';
import type { Game } from '@/lib/types';
import clientPromise from '@/lib/mongodb';

/**
 * Fetches the list of all available games.
 * This function is set up to fetch from MongoDB.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(): Promise<Game[]> {
  try {
    //
    // --- USER TO ADD THEIR DATABASE LOGIC HERE ---
    //
    // Example MongoDB implementation (replace with your actual code):
    //
    // const client = await clientPromise;
    // const db = client.db("your_database_name");
    // const gamesCollection = db.collection<Game>("games");
    // const games = await gamesCollection.find({}).toArray();
    //
    // // The `_id` field from MongoDB needs to be converted to a string
    // // to be serializable for the client component.
    // return games.map(game => ({
    //   ...game,
    //   id: game._id.toString(),
    // }));
    //
    
    // For now, it returns mock data.
    // Replace this with your actual database call above.
    console.log("Fetching games... (from mock data)");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockGames;

  } catch (e) {
    console.error("Failed to fetch games:", e);
    // Return empty array or throw an error, depending on how you want to handle failures.
    return [];
  }
}
