import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const Ctx = createContext(() => {});

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((text, tone = "ok") => {
    const id = Math.random();
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 4200);
  }, []);
  const Icon = { ok: CheckCircle2, error: AlertTriangle, info: Info };
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => {
          const I = Icon[t.tone] || Info;
          return (
            <div key={t.id} className="toast-in flex items-start gap-3 rounded-xl border border-line-2 bg-panel-2 px-4 py-3 text-sm shadow-2xl shadow-black/40">
              <I className={t.tone === "error" ? "mt-0.5 size-4 shrink-0 text-crit" : t.tone === "ok" ? "mt-0.5 size-4 shrink-0 text-ok" : "mt-0.5 size-4 shrink-0 text-cyan"} />
              <span className="flex-1">{t.text}</span>
              <button aria-label="Dismiss" onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))} className="text-faint hover:text-ink"><X className="size-4" /></button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
