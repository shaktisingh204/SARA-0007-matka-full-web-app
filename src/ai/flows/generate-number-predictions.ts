// src/ai/flows/generate-number-predictions.ts
'use server';

/**
 * @fileOverview Generates Matka number predictions based on a proprietary algorithm.
 *
 * - generateNumberPredictions - A function that generates number predictions.
 * - GenerateNumberPredictionsInput - The input type for the generateNumberPredictions function.
 * - GenerateNumberPredictionsOutput - The return type for the generateNumberPredictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNumberPredictionsInputSchema = z.object({
  gameType: z.string().describe('The type of Matka game to generate predictions for.'),
  pastResults: z.string().describe('Past results of the Matka game, to find patterns.'),
});
export type GenerateNumberPredictionsInput = z.infer<typeof GenerateNumberPredictionsInputSchema>;

const GenerateNumberPredictionsOutputSchema = z.object({
  predictions: z.array(z.number()).describe('An array of predicted numbers for the Matka game.'),
  confidence: z.number().describe('A confidence score for the predictions, between 0 and 1.'),
});
export type GenerateNumberPredictionsOutput = z.infer<typeof GenerateNumberPredictionsOutputSchema>;

export async function generateNumberPredictions(input: GenerateNumberPredictionsInput): Promise<GenerateNumberPredictionsOutput> {
  return generateNumberPredictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNumberPredictionsPrompt',
  input: {schema: GenerateNumberPredictionsInputSchema},
  output: {schema: GenerateNumberPredictionsOutputSchema},
  prompt: `You are an expert Matka number prediction specialist.

You will generate number predictions for the specified Matka game type, based on the past results and a proprietary algorithm.

Game Type: {{{gameType}}}
Past Results: {{{pastResults}}}

Predictions:`, // The prompt should be improved to include confidence level, etc.
});

const generateNumberPredictionsFlow = ai.defineFlow(
  {
    name: 'generateNumberPredictionsFlow',
    inputSchema: GenerateNumberPredictionsInputSchema,
    outputSchema: GenerateNumberPredictionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
