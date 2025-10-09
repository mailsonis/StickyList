"use client";
import type { ShoppingList } from "@/lib/types";
import { Check, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShoppingListExportProps {
    list: ShoppingList;
}

export function ShoppingListExport({ list }: ShoppingListExportProps) {
    return (
        <div
            className="p-8 font-body text-foreground"
            style={{
                backgroundColor: list.color,
                width: '400px', 
            }}
        >
            <h2 className="text-4xl font-bold mb-6 break-words">{list.name}</h2>
            <ul className="space-y-4">
                {list.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                        <div className="h-6 w-6 border-2 border-current rounded-md flex items-center justify-center">
                            {item.completed && <Check className="h-5 w-5" />}
                        </div>
                        <span
                            className={cn(
                                "flex-1 text-2xl",
                                item.completed && "line-through text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
