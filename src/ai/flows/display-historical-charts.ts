'use server';

/**
 * @fileOverview This file defines a Genkit flow for displaying historical Matka result charts.
 *
 * The flow takes game name as input and returns a chart data.
 *   - displayHistoricalCharts - A function that retrieves historical chart data for a specified game.
 *   - DisplayHistoricalChartsInput - The input type for the displayHistoricalCharts function.
 *   - DisplayHistoricalChartsOutput - The return type for the displayHistoricalCharts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayHistoricalChartsInputSchema = z.object({
  gameName: z.string().describe('The name of the Matka game for which to retrieve historical chart data.'),
});
export type DisplayHistoricalChartsInput = z.infer<typeof DisplayHistoricalChartsInputSchema>;

const DisplayHistoricalChartsOutputSchema = z.object({
  chartData: z.string().describe('Chart data of past results.'),
});
export type DisplayHistoricalChartsOutput = z.infer<typeof DisplayHistoricalChartsOutputSchema>;

export async function displayHistoricalCharts(input: DisplayHistoricalChartsInput): Promise<DisplayHistoricalChartsOutput> {
  return displayHistoricalChartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayHistoricalChartsPrompt',
  input: {schema: DisplayHistoricalChartsInputSchema},
  output: {schema: DisplayHistoricalChartsOutputSchema},
  prompt: `You are an expert Matka chart data generator.

  Based on the past winning number data, generate a chart that a user can see the historical trends, and number patterns.
  The chart should be designed to be easily readable and interpretable by Matka players.
  Game Name: {{{gameName}}}
  `,
});

const displayHistoricalChartsFlow = ai.defineFlow(
  {
    name: 'displayHistoricalChartsFlow',
    inputSchema: DisplayHistoricalChartsInputSchema,
    outputSchema: DisplayHistoricalChartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
