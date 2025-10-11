// src/firebase/firestore/use-collection.tsx
"use client";
import { useState, useEffect } from "react";
import {
  onSnapshot,
  Query,
  DocumentData,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseCollectionOptions<T> {
  // You can add options like 'where', 'orderBy', 'limit' here in the future
}

export const useCollection = <T extends DocumentData>(
  query: Query<T> | null
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    };

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: (query as any)._query.path.segments.join('/'),
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query ? (query as any)._query.path.segments.join('/') : '']); // Re-run effect if query path changes

  return { data, loading, error };
};
