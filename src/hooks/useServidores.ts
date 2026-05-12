import { useCallback, useEffect, useState } from "react";
import type { Servidor } from "../types";
import { getServidores } from "../api/servidores/get";
import { createServidor } from "../api/servidores/post";
import { deleteServidor } from "../api/servidores/id/delete";

export const useServidores = () => {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServidores();
      setServidores(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar servidores"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const add = async (name: string) => {
    await createServidor(name);
    await fetch();
  };

  const remove = async (id: string) => {
    await deleteServidor(id);
    await fetch();
  };

  return { servidores, loading, error, add, remove, refetch: fetch };
};
