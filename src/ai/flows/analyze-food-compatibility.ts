'use server';

/**
 * @fileOverview Analyzes the compatibility of a food product's ingredients against a user's dietary restrictions.
 *
 * - analyzeFoodCompatibility - A function that handles the food compatibility analysis process.
 * - AnalyzeFoodCompatibilityInput - The input type for the analyzeFoodCompatibility function.
 * - AnalyzeFoodCompatibilityOutput - The return type for the analyzeFoodCompatibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFoodCompatibilityInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A list of ingredients of the food product.'),
  dietaryRestrictions: z
    .string()
    .describe(
      'A list of dietary restrictions, allergies, and health goals of the user.'
    ),
});
export type AnalyzeFoodCompatibilityInput = z.infer<
  typeof AnalyzeFoodCompatibilityInputSchema
>;

const AnalyzeFoodCompatibilityOutputSchema = z.object({
  compatibilityStatus: z
    .enum(['Safe', 'Contains Allergen', 'Not Recommended'])
    .describe(
      'The compatibility status of the food product based on the user\'s dietary restrictions.'
    ),
  reason: z
    .string()
    .describe(
      'The reason for the compatibility status, including specific allergens or ingredients that violate the dietary restrictions.'
    ),
});
export type AnalyzeFoodCompatibilityOutput = z.infer<
  typeof AnalyzeFoodCompatibilityOutputSchema
>;

export async function analyzeFoodCompatibility(
  input: AnalyzeFoodCompatibilityInput
): Promise<AnalyzeFoodCompatibilityOutput> {
  return analyzeFoodCompatibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodCompatibilityPrompt',
  input: {schema: AnalyzeFoodCompatibilityInputSchema},
  output: {schema: AnalyzeFoodCompatibilityOutputSchema},
  prompt: `You are a dietary expert who analyzes food ingredients against user dietary restrictions.

  Analyze the following ingredients against the specified dietary restrictions and provide a compatibility status ('Safe', 'Contains Allergen', 'Not Recommended') and a reason for the determination.

  Ingredients: {{{ingredients}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}

  Ensure that the compatibility status and reason are accurate and informative.
  Consider cross-contamination and hidden sources of allergens.
  Give the status reason in bullet point form.
  `,
});

const analyzeFoodCompatibilityFlow = ai.defineFlow(
  {
    name: 'analyzeFoodCompatibilityFlow',
    inputSchema: AnalyzeFoodCompatibilityInputSchema,
    outputSchema: AnalyzeFoodCompatibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
