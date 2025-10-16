
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, writeBatch } from "firebase/firestore";

import type { ShoppingList, ShoppingItem } from "@/lib/types";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

import { AppHeader } from "@/components/header";
import { ShoppingListCard } from "@/components/shopping-list-card";
import { NewListDialog } from "@/components/new-list-dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const [isClient, setIsClient] = useState(false);

  const listsQuery = user && firestore ? query(collection(firestore, `users/${user.uid}/lists`), orderBy("createdAt", "desc")) : null;
  const { data: lists, loading: listsLoading } = useCollection<ShoppingList>(listsQuery);

  useEffect(() => {
    setIsClient(true);
    if (!user && !userLoading) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  const addList = async (name: string, color: string) => {
    if (!user || !firestore) return;
    const newList = {
      name,
      color,
      items: [],
      rotation: Math.random() * 4 - 2, // -2 to 2 degrees
      createdAt: serverTimestamp(),
      owner: user.uid,
    };
    
    addDoc(collection(firestore, `users/${user.uid}/lists`), newList)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: `users/${user.uid}/lists`,
          operation: 'create',
          requestResourceData: newList,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const deleteList = async (listId: string) => {
    if (!user || !firestore) return;
    const listRef = doc(firestore, `users/${user.uid}/lists`, listId);
    deleteDoc(listRef)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: listRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };
  
  const updateListName = async (listId: string, newName: string) => {
    if (!user || !firestore) return;
    const listRef = doc(firestore, `users/${user.uid}/lists`, listId);
    const updatedData = { name: newName };
    updateDoc(listRef, updatedData)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: listRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const addItem = async (listId: string, itemName: string) => {
    if (!itemName.trim() || !user || !firestore || !lists) return;
    
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      completed: false,
    };
    
    const updatedItems = [...list.items, newItem];
    const listRef = doc(firestore, `users/${user.uid}/lists`, listId);
    const updatedData = { items: updatedItems };

    updateDoc(listRef, updatedData)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: listRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const deleteItem = async (listId: string, itemId: string) => {
    if (!user || !firestore || !lists) return;
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.filter((item) => item.id !== itemId);
    const listRef = doc(firestore, `users/${user.uid}/lists`, listId);
    const updatedData = { items: updatedItems };
    updateDoc(listRef, updatedData)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: listRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const toggleItem = async (listId: string, itemId: string) => {
    if (!user || !firestore || !lists) return;
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    const updatedItems = list.items.map((item) =>
      item.id === itemId
        ? { ...item, completed: !item.completed }
        : item
    );
    const listRef = doc(firestore, `users/${user.uid}/lists`, listId);
    const updatedData = { items: updatedItems };
    updateDoc(listRef, updatedData)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: listRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const updateItemName = async (listId: string, itemId: string, newName: string) => {
    if (!user || !firestore || !lists) return;
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, name: newName } : item
    );

    const listRef = doc(firestore, `users/${user.uid}/lists`, listId);
    const updatedData = { items: updatedItems };
    updateDoc(listRef, updatedData)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: listRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  if (!isClient || userLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
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

        {listsLoading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        )}

        {!listsLoading && lists && lists.length > 0 ? (
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
                onUpdateItemName={updateItemName}
              />
            ))}
          </div>
        ) : (
          !listsLoading && (
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
          )
        )}
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Idealizado Por MailsonRG - Feito com ❤️ e IA</p>
      </footer>
    </div>
  );
}
