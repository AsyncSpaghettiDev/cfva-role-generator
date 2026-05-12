import { useCallback, useEffect, useState } from "react";
import type { Rol } from "../types";
import { getRoles } from "../api/roles/get";
import { createRol } from "../api/roles/post";

export const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const save = async (rol: Omit<Rol, "id">) => {
    const id = await createRol(rol);
    await fetch();
    return id;
  };

  return { roles, loading, error, save, refetch: fetch };
};
