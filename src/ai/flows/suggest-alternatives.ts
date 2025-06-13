// The AI flow that given a food that doesn't match a user's dietary preferences, suggests alternatives.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativesInputSchema = z.object({
  productName: z.string().describe('The name of the food product to find alternatives for.'),
  dietaryPreferences: z.array(z.string()).describe('The dietary preferences of the user, e.g. vegetarian, vegan, gluten-free.'),
  allergies: z.array(z.string()).describe('The allergies of the user, e.g. peanuts, dairy, gluten.'),
});
export type SuggestAlternativesInput = z.infer<typeof SuggestAlternativesInputSchema>;

const SuggestAlternativesOutputSchema = z.object({
  alternatives: z.array(z.string()).describe('A list of alternative food products that match the user\'s dietary preferences and allergies.'),
});
export type SuggestAlternativesOutput = z.infer<typeof SuggestAlternativesOutputSchema>;

export async function suggestAlternatives(input: SuggestAlternativesInput): Promise<SuggestAlternativesOutput> {
  return suggestAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativesPrompt',
  input: {schema: SuggestAlternativesInputSchema},
  output: {schema: SuggestAlternativesOutputSchema},
  prompt: `You are a dietary assistant. A user is looking for alternatives to a food product that they cannot eat.

The product is: {{{productName}}}

The user has the following dietary preferences: {{#each dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

The user has the following allergies: {{#each allergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest 3 alternative products that the user can eat. Return them as a list.

{{#if dietaryPreferences.length}}
The alternatives must match the dietary preferences.{{/if}}

{{#if allergies.length}}
The alternatives must not contain any of the allergies.{{/if}}
`,
});

const suggestAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestAlternativesFlow',
    inputSchema: SuggestAlternativesInputSchema,
    outputSchema: SuggestAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
