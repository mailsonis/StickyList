"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { POST_IT_COLORS } from "@/lib/colors";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome da lista não pode estar vazio." }),
  color: z.string(),
});

type NewListFormValues = z.infer<typeof formSchema>;

interface NewListDialogProps {
  children: ReactNode;
  onListCreate: (name: string, color: string) => void;
}

export function NewListDialog({ children, onListCreate }: NewListDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<NewListFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: POST_IT_COLORS[0].value,
    },
  });

  const onSubmit = (values: NewListFormValues) => {
    onListCreate(values.name, values.color);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Criar Nova Lista</DialogTitle>
          <DialogDescription>
            Dê um nome e escolha uma cor para sua nova lista de compras.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Nome da Lista</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Compras da semana" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Cor da Nota</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-6 gap-2">
                      {POST_IT_COLORS.map((color) => (
                        <button
                          type="button"
                          key={color.value}
                          className={cn(
                            "h-12 w-12 rounded-lg border-2 transition-transform transform hover:scale-110 flex items-center justify-center",
                            field.value === color.value
                              ? "border-primary ring-2 ring-primary"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: color.value }}
                          onClick={() => field.onChange(color.value)}
                          aria-label={`Select ${color.name} color`}
                        >
                          {field.value === color.value && (
                            <Check className="h-6 w-6 text-primary-foreground" />
                          )}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Criar Lista</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
