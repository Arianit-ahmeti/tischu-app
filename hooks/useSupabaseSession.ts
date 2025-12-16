import { supabase } from "@lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface SupabaseSessionState {
  session: Session | null;
  isLoading: boolean;
}

export function useSupabaseSession(): SupabaseSessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const {
        data: { session: sessionResult },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(sessionResult);
      setIsLoading(false);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sessionResult) => {
      if (!isMounted) {
        return;
      }

      setSession(sessionResult);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading };
}
