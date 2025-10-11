"use client";
import type { ShoppingList } from "@/lib/types";
import { Check } from "lucide-react";
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
            <h2 className="text-4xl font-bold mb-12 break-words">{list.name}</h2>
            <ul className="space-y-6">
                {list.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-4">
                        <div className="h-6 w-6 border-2 border-current rounded-md flex items-center justify-center shrink-0 mt-1">
                            {item.completed && <Check className="h-5 w-5" />}
                        </div>
                        <span
                            className={cn(
                                "flex-1 text-2xl break-words",
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
