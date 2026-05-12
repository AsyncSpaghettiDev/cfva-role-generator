import { useCallback, useEffect, useState } from "react";
import type { Uniforme } from "../types";
import { getUniformes } from "../api/uniformes/get";
import { createUniforme } from "../api/uniformes/post";
import { deleteUniforme } from "../api/uniformes/id/delete";

export const useUniformes = () => {
  const [uniformes, setUniformes] = useState<Uniforme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUniformes();
      setUniformes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar uniformes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const add = async (description: string) => {
    await createUniforme(description);
    await fetch();
  };

  const remove = async (id: string) => {
    await deleteUniforme(id);
    await fetch();
  };

  return { uniformes, loading, error, add, remove, refetch: fetch };
};
