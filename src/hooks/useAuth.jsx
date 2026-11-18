import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as auth from "../lib/auth.js";

const Ctx = createContext({ user: null, ready: false, configured: false });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!auth.authConfigured);

  useEffect(() => {
    if (!auth.authConfigured) return;
    auth.currentUser().then((u) => { setUser(u); setReady(true); }).catch(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email, pw, remember) => { const u = await auth.signIn(email, pw, remember); setUser(u); return u; }, []);
  const signOut = useCallback(async () => { await auth.signOut(); setUser(null); }, []);

  return <Ctx.Provider value={{ user, ready, configured: auth.authConfigured, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
