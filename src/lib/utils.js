export const cn = (...c) => c.filter(Boolean).join(" ");

export const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const FREE_MAIL = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "proton.me", "protonmail.com", "live.com"];
export const isBusinessEmail = (v = "") => isEmail(v) && !FREE_MAIL.includes(v.trim().toLowerCase().split("@")[1]);

export function download(filename, content, type = "text/plain") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toCSV(rows, columns) {
  const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [columns.map((c) => esc(c.label)).join(","), ...rows.map((r) => columns.map((c) => esc(typeof c.value === "function" ? c.value(r) : r[c.key])).join(","))].join("\n");
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  }
}

export const fmtDate = (d) => (d ? new Date(d + (d.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
export const today = () => new Date().toISOString().slice(0, 10);
export const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
