import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { Logo } from "../ui/Logo.jsx";
import { authConfigured } from "../../lib/auth.js";

export function AuthShell({ title, subtitle, children, footer, demoCta }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <h1 className="text-[1.9rem] font-extrabold leading-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          {!authConfigured && (
            <div className="mt-6 flex gap-3 rounded-xl border border-cyan/30 bg-cyan/[0.06] p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-cyan" />
              <div>
                <p className="text-ink">Accounts open with early access. Until then you can use the full sample workspace in your browser.</p>
                {demoCta && <Link to={demoCta.to} className="mt-2 inline-block font-semibold text-cyan hover:underline">{demoCta.label} →</Link>}
              </div>
            </div>
          )}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </div>
        <p className="text-center text-xs text-faint">
          <Link to="/privacy" className="hover:text-muted">Privacy</Link> · <Link to="/terms" className="hover:text-muted">Terms</Link> · © 2026 Veyroniq
        </p>
      </div>
      <aside className="relative hidden overflow-hidden border-l border-line bg-bg-2 lg:block" aria-hidden="true">
        <div className="relative flex h-full flex-col justify-center px-14">
          <p className="eyebrow">Veyroniq workspace</p>
          <p className="mt-4 max-w-md font-display text-3xl font-extrabold leading-tight text-ink">See which asset needs attention first — and why.</p>
          <div className="mt-10 max-w-md space-y-3">
            {[["C-402", "Air compressor", "Inlet valve wear", "4–9 days", "border-crit/40 text-crit"], ["P-204", "Transfer pump", "Drive-end bearing wear", "18–26 days", "border-warn/40 text-warn"], ["C-105", "Pneumatic compressor", "Discharge valve leakage", "34–48 days", "border-cyan/30 text-cyan"]].map(([id, n, c, w, t]) => (
              <div key={id} className="flex items-center gap-4 rounded-xl border border-line bg-panel p-4">
                <span className="font-mono text-xs text-muted">{id}</span>
                <div className="flex-1"><p className="text-sm font-semibold text-ink">{n}</p><p className="text-xs text-muted">{c}</p></div>
                <span className={`chip ${t}`}>{w}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-faint">Sample data</p>
        </div>
      </aside>
    </div>
  );
}
