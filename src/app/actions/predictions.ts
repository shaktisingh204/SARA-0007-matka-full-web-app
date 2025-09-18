'use server';

import { generateNumberPredictions, GenerateNumberPredictionsInput } from '@/ai/flows/generate-number-predictions';
import { z } from 'zod';

const predictionSchema = z.object({
  gameType: z.string().min(1, 'Game type is required.'),
  pastResults: z.string().optional(),
});

type PredictionState = {
  predictions?: number[];
  confidence?: number;
  error?: string;
}

export async function getPredictions(
  prevState: PredictionState,
  formData: FormData
): Promise<PredictionState> {
  const validatedFields = predictionSchema.safeParse({
    gameType: formData.get('gameType'),
    pastResults: formData.get('pastResults'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }
  
  try {
    const input: GenerateNumberPredictionsInput = {
      gameType: validatedFields.data.gameType,
      pastResults: validatedFields.data.pastResults || 'No past results provided.',
    };
    
    // Simulate AI call
    // In a real scenario, you would uncomment the following lines:
    // const result = await generateNumberPredictions(input);
    // return { predictions: result.predictions, confidence: result.confidence };

    // Mocked response for demonstration
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockPredictions = Array.from({ length: 3 }, () => Math.floor(Math.random() * 100));
    const mockConfidence = Math.random();
    
    return { predictions: mockPredictions, confidence: mockConfidence };

  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate predictions. Please try again.' };
  }
}
