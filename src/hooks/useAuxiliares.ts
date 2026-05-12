import { useCallback, useEffect, useState } from "react";
import type { Auxiliar } from "../types";
import { getAuxiliares } from "../api/auxiliares/get";
import { createAuxiliar } from "../api/auxiliares/post";
import { deleteAuxiliar } from "../api/auxiliares/id/delete";

export const useAuxiliares = () => {
  const [auxiliares, setAuxiliares] = useState<Auxiliar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuxiliares();
      setAuxiliares(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar auxiliares"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const add = async (name: string) => {
    await createAuxiliar(name);
    await fetch();
  };

  const remove = async (id: string) => {
    await deleteAuxiliar(id);
    await fetch();
  };

  return { auxiliares, loading, error, add, remove, refetch: fetch };
};
