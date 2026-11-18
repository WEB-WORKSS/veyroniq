/**
 * Workspace data layer.
 *
 * - API mode (VITE_API_URL set + signed-in Cognito user): records go to the workspace API
 *   (GET/PUT {API}/workspace with a Bearer ID token). See README → Workspace API contract.
 * - Local mode (default): the sample workspace is kept in this browser's localStorage.
 *   This is a demonstration store only — it is not secure or shared persistence.
 */
import { seedWorkspace } from "../data/product-data.js";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const apiConfigured = Boolean(API);
const KEY = "vq.workspace.v1";
const PROFILE_KEY = "vq.profile.v1";

const ls = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Workspace API error ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export function createStore(user) {
  const remote = apiConfigured && user?.idToken;
  return {
    mode: remote ? "api" : "local",
    async load() {
      if (remote) return api("/workspace", { token: user.idToken });
      return ls.get(KEY) || this.reset();
    },
    async save(data) {
      if (remote) return api("/workspace", { method: "PUT", body: data, token: user.idToken });
      if (!ls.set(KEY, data)) throw new Error("This browser blocked local storage, so changes can't be kept.");
      return data;
    },
    reset() { const d = seedWorkspace(); ls.set(KEY, d); return d; },
    async loadProfile() {
      if (remote) return api("/profile", { token: user.idToken });
      return ls.get(PROFILE_KEY);
    },
    async saveProfile(p) {
      if (remote) return api("/profile", { method: "PUT", body: p, token: user.idToken });
      ls.set(PROFILE_KEY, p);
      return p;
    },
    clearLocal() { ls.del(KEY); ls.del(PROFILE_KEY); },
  };
}
