import { useEffect, useState } from "react";
import type { EnumObject } from "../lib/supabaseEnumHandler";

interface UseEnumResult<T extends string> {
  enumObj: EnumObject<T> | null;
  loading: boolean;
  error: Error | null;
}

export function useEnum<T extends string>(
  fetchFn: () => Promise<EnumObject<T>>,
): UseEnumResult<T> {
  const [enumObj, setEnumObj] = useState<EnumObject<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEnum = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setEnumObj(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnum();
  }, [fetchFn]);

  return { enumObj, loading, error };
}
