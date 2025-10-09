export type ShoppingItem = {
  id: string;
  name: string;
  completed: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  color: string;
  items: ShoppingItem[];
  rotation: number;
};
