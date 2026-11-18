import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Loader2, X } from "lucide-react";
import { cn, copyText } from "../../lib/utils.js";

export function Field({ label, error, hint, children, className }) {
  const id = useId();
  const child = typeof children === "function" ? children({ id, "aria-invalid": !!error, "aria-describedby": error || hint ? `${id}-d` : undefined }) : children;
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      {child}
      {(error || hint) && <p id={`${id}-d`} className={cn("mt-1.5 text-xs", error ? "text-crit" : "text-faint")}>{error || hint}</p>}
    </div>
  );
}

export function Spinner({ className = "size-4" }) {
  return <Loader2 className={cn("animate-spin", className)} aria-hidden="true" />;
}

export function SubmitButton({ loading, children, className = "btn btn-primary w-full", ...p }) {
  return (
    <button type="submit" className={className} disabled={loading} {...p}>
      {loading && <Spinner />} {children}
    </button>
  );
}

export function Modal({ open, onClose, title, children, footer, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector("input,select,textarea,button")?.focus();
    return () => { document.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cn("toast-in max-h-[92vh] w-full overflow-auto rounded-t-2xl border border-line-2 bg-panel shadow-2xl sm:rounded-2xl", wide ? "sm:max-w-2xl" : "sm:max-w-lg")}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="btn-ghost btn p-1.5" aria-label="Close"><X className="size-4" /></button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, body, confirmLabel = "Delete" }) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button></>}>
      <p className="text-sm text-muted">{body}</p>
    </Modal>
  );
}

export function CopyButton({ text, label = "Copy", className = "" }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={cn("btn btn-line px-2.5 py-1.5 text-xs", className)}
      onClick={async () => { if (await copyText(text)) { setDone(true); setTimeout(() => setDone(false), 1500); } }}>
      {done ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />} {done ? "Copied" : label}
    </button>
  );
}

const TONES = {
  healthy: "border-ok/30 bg-ok/10 text-ok", watch: "border-warn/30 bg-warn/10 text-warn", act: "border-crit/30 bg-crit/10 text-crit",
  offline: "border-off/40 bg-off/15 text-muted", info: "border-cyan/30 bg-cyan/10 text-cyan", neutral: "border-line-2 bg-panel-2 text-muted",
  critical: "border-crit/30 bg-crit/10 text-crit", warning: "border-warn/30 bg-warn/10 text-warn", blue: "border-blue/40 bg-blue/15 text-blue-2",
};
export function Chip({ tone = "neutral", children, className }) {
  return <span className={cn("chip", TONES[tone] || TONES.neutral, className)}>{children}</span>;
}

export function Empty({ icon: I, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-2 px-6 py-12 text-center">
      {I && <I className="mb-3 size-6 text-faint" />}
      <p className="font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SectionHead({ eyebrow, title, lede, className, center }) {
  return (
    <div className={cn("mb-12 max-w-[760px]", center && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="h2">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}
