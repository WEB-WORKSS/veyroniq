import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function useTable(rows, { search = [], initialSort } = {}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(initialSort || null);
  const [filters, setFilters] = useState({});
  const view = useMemo(() => {
    let r = rows || [];
    const s = q.trim().toLowerCase();
    if (s) r = r.filter((x) => search.some((k) => String(x[k] ?? "").toLowerCase().includes(s)));
    for (const [k, v] of Object.entries(filters)) if (v && v !== "All") r = r.filter((x) => x[k] === v);
    if (sort) {
      const [k, dir] = sort;
      r = [...r].sort((a, b) => { const A = a[k], B = b[k]; const c = typeof A === "number" && typeof B === "number" ? A - B : String(A ?? "").localeCompare(String(B ?? ""), undefined, { numeric: true }); return dir === "asc" ? c : -c; });
    }
    return r;
  }, [rows, q, sort, filters]);
  return { view, q, setQ, sort, setSort, filters, setFilter: (k, v) => setFilters((f) => ({ ...f, [k]: v })) };
}

export function SortTh({ k, label, t, className = "" }) {
  const on = t.sort?.[0] === k;
  const dir = on ? t.sort[1] : null;
  const I = !on ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th className={`th ${className}`} aria-sort={on ? (dir === "asc" ? "ascending" : "descending") : "none"}>
      <button className="inline-flex items-center gap-1 uppercase hover:text-ink" onClick={() => t.setSort(on && dir === "asc" ? [k, "desc"] : [k, "asc"])}>{label}<I className="size-3" /></button>
    </th>
  );
}

export function Toolbar({ t, placeholder, filters = [], children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <label className="relative min-w-[200px] flex-1 sm:max-w-xs"><span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <input type="search" className="input pl-9" placeholder={placeholder} value={t.q} onChange={(e) => t.setQ(e.target.value)} />
      </label>
      {filters.map(([k, label, opts]) => (
        <label key={k} className="flex items-center gap-2 text-xs text-muted"><span className="sr-only sm:not-sr-only">{label}</span>
          <select className="input w-auto py-2" value={t.filters[k] || "All"} onChange={(e) => t.setFilter(k, e.target.value)}>
            {["All", ...opts].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
      ))}
      <div className="ml-auto flex gap-2">{children}</div>
    </div>
  );
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-2xl font-extrabold">{title}</h1>{sub && <p className="mt-1 text-sm text-muted">{sub}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export const assetName = (data, id) => { const a = data.assets.find((x) => x.id === id); return a ? `${a.id} · ${a.name}` : `${id} (removed)`; };
