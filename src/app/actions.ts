"use server";

import { suggestShoppingItems as suggestShoppingItemsFlow, type SuggestShoppingItemsInput } from "@/ai/flows/suggest-shopping-items";

export async function getSuggestions(input: SuggestShoppingItemsInput): Promise<string[]> {
  try {
    const result = await suggestShoppingItemsFlow(input);
    return result.suggestedItems;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    // Return an empty array or throw a custom error to be handled by the client
    return [];
  }
}
