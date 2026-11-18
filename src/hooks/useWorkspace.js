import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createStore } from "../lib/store.js";
import { useAuth } from "./useAuth.jsx";
import { uid } from "../lib/utils.js";

/** Loads the workspace and exposes CRUD helpers that persist after every change and log activity. */
export function useWorkspace() {
  const { user } = useAuth();
  const store = useMemo(() => createStore(user), [user]);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const dataRef = useRef(null);

  useEffect(() => {
    let live = true;
    Promise.all([store.load(), store.loadProfile()])
      .then(([d, p]) => { if (live) { dataRef.current = d; setData(d); setProfile(p); } })
      .catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [store]);

  const commit = useCallback(async (fn, text) => {
    const prev = dataRef.current;
    const next = fn(structuredClone(prev));
    if (text) next.activity = [{ id: uid("ev"), at: new Date().toISOString(), text, by: user?.name || "You" }, ...(next.activity || [])].slice(0, 200);
    dataRef.current = next; setData(next);
    try { await store.save(next); }
    catch (e) { dataRef.current = prev; setData(prev); throw e; }
  }, [store, user]);

  const crud = (col, prefix, label) => ({
    create: (rec, desc) => commit((d) => { d[col] = [{ ...rec, id: rec.id || uid(prefix) }, ...d[col]]; return d; }, desc || `${label} created: ${rec.title || rec.name}`),
    update: (id, patch, desc) => commit((d) => { d[col] = d[col].map((r) => (r.id === id ? { ...r, ...patch } : r)); return d; }, desc || `${label} ${id} updated`),
    remove: (id, desc) => commit((d) => { d[col] = d[col].filter((r) => r.id !== id); return d; }, desc || `${label} ${id} deleted`),
  });

  return {
    data, profile, error, mode: store.mode,
    assets: crud("assets", "A", "Asset"),
    alerts: crud("alerts", "AL", "Alert"),
    workOrders: crud("workOrders", "WO", "Work order"),
    inspections: crud("inspections", "IN", "Inspection"),
    commit,
    saveProfile: async (p) => { await store.saveProfile(p); setProfile(p); },
    resetSample: async () => { const d = store.reset(); dataRef.current = d; setData(d); },
    clearAll: () => { store.clearLocal(); },
  };
}
