import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Account from "./Account";
import Auth from "./Auth";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session && session.user) {
    return <Account key={session.user.id} session={session} />;
  } else {
    return <Auth />;
  }
}
