import Account from "@app/Account";
import Auth from "@app/Auth";
import { supabase } from "@lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { BottomNavigation } from "@components";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {session && session.user ? (
        <>
          <Account key={session.user.id} session={session} />
          <BottomNavigation />
        </>
      ) : (
        <Auth />
      )}
    </View>
  );
}
