import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { seedWorkspace, FORECASTS, LINES, statusOf, trend } from "../../data/product-data.js";
import { Chip, SectionHead } from "../ui/primitives.jsx";

export function Sparkline({ data, className = "h-24 w-full", stroke = "#5B8CFF", threshold }) {
  const W = 300, H = 80, min = Math.min(...data, threshold ?? Infinity) - 0.3, max = Math.max(...data, threshold ?? -Infinity) + 0.3;
  const y = (v) => H - ((v - min) / (max - min)) * H;
  const d = data.map((v, i) => `${i ? "L" : "M"}${((i / (data.length - 1)) * W).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {threshold != null && <line x1="0" x2={W} y1={y(threshold)} y2={y(threshold)} stroke="#F5B83D" strokeDasharray="4 4" strokeOpacity=".7" />}
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const LABEL = { healthy: "Healthy", watch: "Watch", act: "Act now", offline: "Offline" };

export function Showcase() {
  const { assets } = useMemo(() => seedWorkspace(), []);
  const [line, setLine] = useState("All");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("C-402");
  const list = assets.filter((a) => (line === "All" || a.line === line) && `${a.id} ${a.name}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.health - b.health);
  const a = assets.find((x) => x.id === sel) || list[0];
  const fc = a && FORECASTS[a.id];

  return (
    <section id="demo" className="py-24">
      <div className="wrap">
        <SectionHead eyebrow="Interactive product showcase" title="Try the workspace on a sample plant."
          lede="Filter assets, open one to see its vibration trend, forecast and recommended work. Everything here is fictional sample data for “Ridgeway Packaging · Plant 2”." />
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
            <label className="relative flex-1 sm:max-w-xs"><span className="sr-only">Search assets</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input className="input pl-9" placeholder="Search assets" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by line">
              {["All", ...LINES].map((l) => <button key={l} onClick={() => setLine(l)} aria-pressed={line === l} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${line === l ? "bg-blue text-white" : "text-muted hover:bg-panel-2"}`}>{l}</button>)}
            </div>
            <Chip tone="warning" className="ml-auto">Sample data</Chip>
          </div>
          <div className="grid lg:grid-cols-[1fr_1.15fr]">
            <ul className="max-h-[420px] overflow-auto border-line lg:border-r" aria-label="Assets">
              {list.length === 0 && <li className="p-6 text-sm text-muted">No assets match that search.</li>}
              {list.map((x) => {
                const s = statusOf(x.health);
                return (
                  <li key={x.id}>
                    <button onClick={() => setSel(x.id)} aria-current={sel === x.id} className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-sm transition ${sel === x.id ? "bg-blue/10" : "hover:bg-panel-2"}`}>
                      <span className="w-14 font-mono text-xs text-muted">{x.id}</span>
                      <span className="flex-1 truncate">{x.name}<span className="ml-2 text-xs text-faint">{x.line}</span></span>
                      <Chip tone={s}>{x.health} · {LABEL[s]}</Chip>
                    </button>
                  </li>
                );
              })}
            </ul>
            {a && (
              <div className="p-5" aria-live="polite">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-mono text-xs text-muted">{a.id} · {a.type} · {a.line}</p><h3 className="mt-1 text-xl font-bold">{a.name}</h3></div>
                  <div className="text-right"><p className="text-xs text-faint">Health</p><p className="font-display text-3xl font-extrabold">{a.health}</p></div>
                </div>
                <div className="mt-4 rounded-xl border border-line bg-bg-2 p-3">
                  <p className="text-xs text-muted">Vibration velocity · last 48 h (mm/s RMS)</p>
                  <Sparkline data={trend(a)} threshold={7.1} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  {[["Vibration", `${a.vibration} mm/s`], ["Temperature", `${a.temperature} °C`], ["Runtime", `${a.runtimeHours.toLocaleString()} h`]].map(([k, v]) => <div key={k} className="rounded-lg border border-line px-3 py-2"><p className="text-[0.7rem] text-faint">{k}</p><p className="font-mono">{v}</p></div>)}
                </div>
                {fc ? (
                  <div className="mt-3 rounded-xl border border-warn/30 bg-warn/[0.06] p-4 text-sm">
                    <p className="font-semibold text-warn">Forecast · {fc.component}</p>
                    <p className="mt-1 text-muted">Likely failure window <b className="text-ink">{fc.window[0]}–{fc.window[1]} days</b> · confidence {fc.confidence.toLowerCase()}</p>
                    <p className="mt-2 text-muted">{fc.action}</p>
                  </div>
                ) : <p className="mt-3 rounded-xl border border-ok/30 bg-ok/[0.06] p-4 text-sm text-muted">No degradation forecast. Readings are within this asset's normal range.</p>}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">The full sample workspace adds assets, alerts, work orders, inspections, reports and CSV/PDF export.</p>
          <Link to="/dashboard" className="btn btn-primary">Open the full sample workspace <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
