// Summarize the key nutritional aspects and potential health impacts of a food product using AI.

'use server';

/**
 * @fileOverview Summarizes ingredient information of a food product.
 *
 * - summarizeIngredientInformation - A function that summarizes the ingredient information.
 * - SummarizeIngredientInformationInput - The input type for the summarizeIngredientInformation function.
 * - SummarizeIngredientInformationOutput - The return type for the summarizeIngredientInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIngredientInformationInputSchema = z.object({
  ingredients: z.string().describe('The list of ingredients of a food product.'),
  productName: z.string().describe('The name of the food product.'),
});
export type SummarizeIngredientInformationInput = z.infer<
  typeof SummarizeIngredientInformationInputSchema
>;

const SummarizeIngredientInformationOutputSchema = z.object({
  summary: z.string().describe('A summary of the key nutritional aspects and potential health impacts of the food product.'),
});
export type SummarizeIngredientInformationOutput = z.infer<
  typeof SummarizeIngredientInformationOutputSchema
>;

export async function summarizeIngredientInformation(
  input: SummarizeIngredientInformationInput
): Promise<SummarizeIngredientInformationOutput> {
  return summarizeIngredientInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIngredientInformationPrompt',
  input: {schema: SummarizeIngredientInformationInputSchema},
  output: {schema: SummarizeIngredientInformationOutputSchema},
  prompt: `You are an AI assistant that summarizes the key nutritional aspects and potential health impacts of a food product. Product name: {{{productName}}}. Ingredients: {{{ingredients}}}.`,
});

const summarizeIngredientInformationFlow = ai.defineFlow(
  {
    name: 'summarizeIngredientInformationFlow',
    inputSchema: SummarizeIngredientInformationInputSchema,
    outputSchema: SummarizeIngredientInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
