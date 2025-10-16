
"use client";

import { useState, useRef, useTransition, useCallback, useEffect } from "react";
import type { ShoppingList, ShoppingItem } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, Check, X, Pencil, Download } from "lucide-react";
import { toPng } from 'html-to-image';
import { ShoppingListExport } from "./shopping-list-export";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const itemFormSchema = z.object({
  itemName: z.string().min(1, { message: "Item cannot be empty." }),
});

const listNameSchema = z.object({
  name: z.string().min(1, { message: "O nome da lista não pode estar vazio." }),
});

const editItemNameSchema = z.object({
  name: z.string().min(1, { message: "O nome do item não pode estar vazio." }),
});

interface ShoppingListCardProps {
  list: ShoppingList;
  onAddItem: (listId: string, itemName: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onDeleteList: (listId: string) => void;
  onUpdateListName: (listId: string, newName: string) => void;
  onUpdateItemName: (listId: string, itemId: string, newName: string) => void;
}

export function ShoppingListCard({
  list,
  onAddItem,
  onDeleteItem,
  onToggleItem,
  onDeleteList,
  onUpdateListName,
  onUpdateItemName,
}: ShoppingListCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isExporting, startExportTransition] = useTransition();
  const { toast } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);


  const form = useForm({
    resolver: zodResolver(itemFormSchema),
    defaultValues: { itemName: "" },
  });

  const nameForm = useForm({
    resolver: zodResolver(listNameSchema),
    defaultValues: { name: list.name },
  });

  const editItemForm = useForm({
    resolver: zodResolver(editItemNameSchema),
  });

  useEffect(() => {
    if (editingItemId) {
      const item = list.items.find(i => i.id === editingItemId);
      if (item) {
        editItemForm.setValue('name', item.name);
      }
    }
  }, [editingItemId, list.items, editItemForm]);

  const onSubmit = (data: z.infer<typeof itemFormSchema>) => {
    onAddItem(list.id, data.itemName);
    form.reset();
  };

  const handleNameUpdate = (data: z.infer<typeof listNameSchema>) => {
    onUpdateListName(list.id, data.name);
    setIsEditingName(false);
  };
  
  const handleItemNameUpdate = (data: z.infer<typeof editItemNameSchema>) => {
    if (editingItemId) {
      onUpdateItemName(list.id, editingItemId, data.name);
      setEditingItemId(null);
    }
  };

  const filter = (node: HTMLElement) => {
    const exclusionClasses = ['hidden-export'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  }

  const handleExport = useCallback(() => {
    if (exportRef.current === null) {
      return
    }
    startExportTransition(async () => {
      try {
        const fontCss = await fetch('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap').then(res => res.text());

        const dataUrl = await toPng(exportRef.current!, { 
            cacheBust: true, 
            filter,
            fontEmbedCSS: fontCss
        });
        
        const link = document.createElement('a');
        link.download = `${list.name.replace(/ /g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error(err);
        toast({
            variant: "destructive",
            title: "Uh oh! Algo deu errado.",
            description: "Não foi possível exportar la lista como imagem.",
        })
      }
    })
  }, [exportRef, list.name, toast]);

  const formattedDate = list.createdAt ? (list.createdAt as any).toDate().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) : '';

  return (
    <>
    <div className="absolute -left-[9999px] top-0">
      <div ref={exportRef}>
        <ShoppingListExport list={list} />
      </div>
    </div>
    <Card
      className="flex flex-col h-full shadow-lg border-2 border-black/5 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:!rotate-0"
      style={{
        backgroundColor: list.color,
        transform: `rotate(${list.rotation}deg)`,
      }}
    >
      <CardHeader className="flex-row items-start justify-between gap-2 pb-2">
        <div className="w-full">
          {isEditingName ? (
            <Form {...nameForm}>
              <form onSubmit={nameForm.handleSubmit(handleNameUpdate)} className="flex items-center gap-2">
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} className="text-2xl font-bold p-1 h-auto bg-transparent border-primary" autoFocus />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 hidden-export"><Check className="h-5 w-5"/></Button>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 hidden-export" onClick={() => setIsEditingName(false)}><X className="h-5 w-5"/></Button>
              </form>
            </Form>
          ) : (
            <h2 className="text-3xl font-bold break-words">{list.name}</h2>
          )}
        </div>
        <div className="flex items-center hidden-export">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingName(true)}>
                <Pencil className="h-5 w-5" />
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente sua lista de compras.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteList(list.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 py-4">
        {list.items.length > 0 ? (
          <ul className="space-y-3">
            {list.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 group">
                {editingItemId === item.id ? (
                  <Form {...editItemForm}>
                    <form onSubmit={editItemForm.handleSubmit(handleItemNameUpdate)} className="flex items-center gap-2 w-full">
                      <FormField
                        control={editItemForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input {...field} className="text-xl p-1 h-auto bg-transparent border-primary" autoFocus />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 hidden-export"><Check className="h-5 w-5"/></Button>
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8 hidden-export" onClick={() => setEditingItemId(null)}><X className="h-5 w-5"/></Button>
                    </form>
                  </Form>
                ) : (
                  <>
                    <Checkbox
                      id={`item-${list.id}-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => onToggleItem(list.id, item.id)}
                      className="h-6 w-6 rounded-md hidden-export"
                    />
                    <label
                      htmlFor={`item-${list.id}-${item.id}`}
                      className={cn(
                        "flex-1 text-xl cursor-pointer transition-colors",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </label>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity hidden-export">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setEditingItemId(item.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                        onClick={() => onDeleteItem(list.id, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">Adicione seu primeiro item!</p>
        )}
      </CardContent>
      <Separator className="my-2 bg-black/10"/>
      <CardFooter className="flex-col items-start gap-2 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-2">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Novo item..." {...field} className="bg-background/50 border-foreground/20 focus-visible:border-primary border-2 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" className="hidden-export">
              <Plus />
            </Button>
          </form>
        </Form>
        <div className="flex gap-2 w-full justify-between items-center mt-2">
            <div className="text-xs text-foreground/70">
                <p>Criado em</p>
                <span className="font-medium">{formattedDate}</span>
            </div>
            <Button variant="ghost" className="hidden-export text-foreground/70 hover:text-foreground" onClick={handleExport} disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Exportar
            </Button>
        </div>
      </CardFooter>
    </Card>
    </>
  );
}
