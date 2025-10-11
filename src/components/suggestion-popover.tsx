
"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Check } from "lucide-react";
import type { ShoppingList } from "@/lib/types";
import { getSuggestions } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SuggestionPopoverProps {
  children: ReactNode;
  list: ShoppingList;
  onAddSuggestedItems: (listId: string, items: string[]) => void;
}

export function SuggestionPopover({
  children,
  list,
  onAddSuggestedItems,
}: SuggestionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleFetchSuggestions = () => {
    startTransition(async () => {
      // For now, let's use the list items as past purchases for context
      const pastPurchases = list.items.map(item => item.name);
      const result = await getSuggestions({ listName: list.name, pastPurchases });
      const uniqueSuggestions = Array.from(new Set(result.filter(item => !list.items.find(i => i.name.toLowerCase() === item.toLowerCase()))));
      setSuggestions(uniqueSuggestions);
      setSelectedSuggestions(uniqueSuggestions);
    });
  };

  const handleToggleSuggestion = (item: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  const handleAddItems = () => {
    if (selectedSuggestions.length > 0) {
      onAddSuggestedItems(list.id, selectedSuggestions);
    }
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      handleFetchSuggestions();
    } else {
      setSuggestions([]);
      setSelectedSuggestions([]);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                Sugestões Inteligentes
            </h4>
            <p className="text-sm text-muted-foreground">
              Baseado no nome e items da sua lista.
            </p>
          </div>
          {isPending ? (
            <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid gap-2">
                {suggestions.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`suggestion-${index}`} 
                            checked={selectedSuggestions.includes(item)}
                            onCheckedChange={() => handleToggleSuggestion(item)}
                        />
                        <Label htmlFor={`suggestion-${index}`} className="text-base font-normal">{item}</Label>
                    </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma sugestão encontrada.</p>
          )}

            <Button onClick={handleAddItems} disabled={selectedSuggestions.length === 0}>
                <Check className="mr-2 h-4 w-4" />
                Adicionar {selectedSuggestions.length > 0 ? `(${selectedSuggestions.length})` : ''}
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
