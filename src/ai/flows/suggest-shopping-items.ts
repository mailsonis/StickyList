'use server';

/**
 * @fileOverview A shopping list item suggestion AI agent.
 *
 * - suggestShoppingItems - A function that suggests shopping items.
 * - SuggestShoppingItemsInput - The input type for the suggestShoppingItems function.
 * - SuggestShoppingItemsOutput - The return type for the suggestShoppingItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShoppingItemsInputSchema = z.object({
  listName: z.string().describe('The name of the shopping list.'),
  pastPurchases: z.array(z.string()).describe('A list of the user\'s past purchases.'),
});
export type SuggestShoppingItemsInput = z.infer<typeof SuggestShoppingItemsInputSchema>;

const SuggestShoppingItemsOutputSchema = z.object({
  suggestedItems: z.array(z.string()).describe('A list of suggested items to add to the shopping list.'),
});
export type SuggestShoppingItemsOutput = z.infer<typeof SuggestShoppingItemsOutputSchema>;

export async function suggestShoppingItems(input: SuggestShoppingItemsInput): Promise<SuggestShoppingItemsOutput> {
  return suggestShoppingItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestShoppingItemsPrompt',
  input: {schema: SuggestShoppingItemsInputSchema},
  output: {schema: SuggestShoppingItemsOutputSchema},
  prompt: `You are a helpful shopping assistant. Based on the name of the shopping list and the user\'s past purchases, suggest items that the user might want to add to the list.

List Name: {{{listName}}}
Past Purchases: {{#each pastPurchases}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggested Items:`, // Ensure output is parsable as a JSON array of strings
});

const suggestShoppingItemsFlow = ai.defineFlow(
  {
    name: 'suggestShoppingItemsFlow',
    inputSchema: SuggestShoppingItemsInputSchema,
    outputSchema: SuggestShoppingItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
