"use client";

import { useState, useEffect } from "react";
import type { ShoppingList, ShoppingItem } from "@/lib/types";
import { Plus } from "lucide-react";

import { AppHeader } from "@/components/header";
import { ShoppingListCard } from "@/components/shopping-list-card";
import { NewListDialog } from "@/components/new-list-dialog";
import { Button } from "@/components/ui/button";

const initialLists: ShoppingList[] = [
  {
    id: "1",
    name: "Compras da Semana",
    color: "#FFF8C6",
    items: [
      { id: "1-1", name: "Leite", completed: true },
      { id: "1-2", name: "Pão", completed: false },
      { id: "1-3", name: "Ovos", completed: false },
      { id: "1-4", name: "Frutas", completed: false },
    ],
    rotation: 1.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Churrasco Fim de Semana",
    color: "#D9E8FF",
    items: [
      { id: "2-1", name: "Picanha", completed: false },
      { id: "2-2", name: "Linguiça", completed: false },
      { id: "2-3", name: "Pão de alho", completed: true },
      { id: "2-4", name: "Carvão", completed: true },
      { id: "2-5", name: "Cerveja", completed: false },
    ],
    rotation: -1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Material Escritório",
    color: "#D9FFD9",
    items: [
      { id: "3-1", name: "Canetas", completed: false },
      { id: "3-2", name: "Post-its", completed: false },
    ],
    rotation: 1,
    createdAt: new Date().toISOString(),
  },
];


export default function Home() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // For demo, let's add createdAt to initial lists if they don't have it.
    setLists(initialLists.map(l => ({...l, createdAt: l.createdAt || new Date().toISOString() })));
  }, []);

  const addList = (name: string, color: string) => {
    const newList: ShoppingList = {
      id: `list-${Date.now()}`,
      name,
      color,
      items: [],
      rotation: Math.random() * 4 - 2, // -2 to 2 degrees
      createdAt: new Date().toISOString(),
    };
    setLists((prev) => [...prev, newList]);
  };

  const deleteList = (listId: string) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
  };
  
  const updateListName = (listId: string, newName: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    ));
  };

  const addItem = (listId: string, itemName: string) => {
    if (!itemName.trim()) return;
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      completed: false,
    };
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, items: [...list.items, newItem] } : list
      )
    );
  };

  const deleteItem = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  const toggleItem = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
          : list
      )
    );
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl text-foreground/80">
            Suas Listas
          </h1>
          <NewListDialog onListCreate={addList}>
            <Button size="lg" className="md:w-auto w-12 h-12 md:h-11 md:px-8">
              <Plus className="h-6 w-6 md:mr-2" />
              <span className="hidden md:inline">Criar Nova Lista</span>
            </Button>
          </NewListDialog>
        </div>

        {lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {lists.map((list) => (
              <ShoppingListCard
                key={list.id}
                list={list}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                onToggleItem={toggleItem}
                onDeleteList={deleteList}
                onUpdateListName={updateListName}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <h2 className="text-2xl text-muted-foreground mb-4">
              Nenhuma lista por aqui!
            </h2>
            <p className="text-muted-foreground mb-6">
              Que tal criar sua primeira lista de compras?
            </p>
            <NewListDialog onListCreate={addList}>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar sua Primeira Lista
              </Button>
            </NewListDialog>
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Feito com ❤️ por StickyList</p>
      </footer>
    </div>
  );
}
