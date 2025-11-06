import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Account from "./components/Account";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabase";

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

    if (session && session.user) {
        return <Account key={session.user.id} session={session} />;
    } else {
        return <Auth />;
    }
}
