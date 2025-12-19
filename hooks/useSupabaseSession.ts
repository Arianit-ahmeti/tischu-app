import { supabase } from "@lib/supabase";
import { SessionType } from "@lib/types";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface SupabaseSessionState {
  session: Session | null;
  type: SessionType | null;
  isLoading: boolean;
}

export function useSupabaseSession(): SupabaseSessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [type, setType] = useState<SessionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const determineSessionType = async (sessionResult: Session | null): Promise<SessionType | null> => {
      if (!sessionResult?.user) {
        return null;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("type")
          .eq("id", sessionResult.user.id)
          .single();

        if (!profileError && profileData) {
          switch (profileData.type) {
            case "user":
              return SessionType.user;
            case "organization":
              return SessionType.organization;
            default:
              return SessionType.user;
          }
        }

        return SessionType.user;
      } catch (error) {
        console.error("Failed to determine session type:", error);
        return SessionType.user;
      }
    };

    const updateSessionState = async (sessionResult: Session | null) => {
      if (!isMounted) return;

      try {
        const sessionType = await determineSessionType(sessionResult);
        setSession(sessionResult);
        setType(sessionType);
        setIsLoading(false);
      } catch (error) {
        console.error("Error updating session state:", error);
        setSession(sessionResult);
        setType(SessionType.user);
        setIsLoading(false);
      }
    };

    const syncSession = async () => {
      const {
        data: { session: sessionResult },
      } = await supabase.auth.getSession();
      await updateSessionState(sessionResult);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, sessionResult) => {
      await updateSessionState(sessionResult);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, type, isLoading };
}
