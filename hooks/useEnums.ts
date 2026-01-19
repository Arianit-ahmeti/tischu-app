import type { EnumObject } from "@lib/supabaseEnumHandler";
import { useEffect, useRef, useState } from "react";

type EnumFetchers<T extends Record<string, string>> = {
  [K in keyof T]: () => Promise<EnumObject<T[K]>>;
};

type EnumResults<T extends Record<string, string>> = {
  [K in keyof T]: EnumObject<T[K]> | null;
};

interface UseEnumsResult<T extends Record<string, string>> {
  enums: EnumResults<T>;
  loading: boolean;
  error: Error | null;
}

export function useEnums<T extends Record<string, string>>(fetchers: EnumFetchers<T>): UseEnumsResult<T> {
  const [enums, setEnums] = useState<EnumResults<T>>(() => {
    const initial = {} as EnumResults<T>;
    for (const key in fetchers) {
      initial[key] = null;
    }
    return initial;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchersRef = useRef(fetchers);

  useEffect(() => {
    fetchersRef.current = fetchers;
  });

  useEffect(() => {
    const fetchAllEnums = async () => {
      try {
        setLoading(true);
        setError(null);

        const entries = Object.entries(fetchersRef.current) as [keyof T, () => Promise<EnumObject<string>>][];
        const results = await Promise.all(
          entries.map(async ([key, fetchFn]) => {
            const result = await fetchFn();
            return [key, result] as const;
          })
        );

        const enumsObject = {} as EnumResults<T>;
        for (const [key, result] of results) {
          enumsObject[key] = result as any;
        }

        setEnums(enumsObject);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchAllEnums();
  }, []);

  return { enums, loading, error };
}
