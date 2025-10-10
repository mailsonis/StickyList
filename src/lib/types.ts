import type { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp | { toDate: () => Date };
};
