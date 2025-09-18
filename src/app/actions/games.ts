// src/app/actions/games.ts
'use server';

import { games as mockGames } from '@/lib/data';
import type { Game } from '@/lib/types';
import clientPromise from '@/lib/mongodb';
import { Collection, Db, MongoClient } from 'mongodb';

/**
 * Fetches the list of all available games from MongoDB.
 * Falls back to mock data if the database is empty or an error occurs.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(): Promise<Game[]> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("matka"); // Replace "matka" with your actual database name
    const gamesCollection: Collection<Game> = db.collection<Game>("games");
    
    const games = await gamesCollection.find({}).toArray();

    // If the database returns games, process and return them.
    if (games.length > 0) {
      console.log("Fetching games... (from MongoDB)");
      // The `_id` field from MongoDB needs to be converted to a string
      // to be serializable for the client component.
      return games.map((game: any) => ({
        ...game,
        id: game._id.toString(),
      }));
    }
  } catch (e) {
    console.error("Failed to fetch games from MongoDB:", e);
    // The connection will be handled by the singleton `clientPromise`,
    // so we don't need to close it here.
  }

  // Fallback to mock data if the try block fails or returns no games.
  console.log("MongoDB is empty or connection failed. Falling back to mock data.");
  return mockGames;
}
