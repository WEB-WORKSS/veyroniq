import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { rng } from "../../data/product-data.js";

const ASSETS = [["P-204", "Transfer pump", 62], ["M-311", "Filler drive motor", 91], ["G-118", "Capper gearbox", 84], ["C-402", "Air compressor", 38], ["F-207", "Exhaust fan", 88]];
const tone = (h) => (h >= 75 ? "bg-ok" : h >= 50 ? "bg-warn" : "bg-crit");

function useWave(n = 90) {
  const r = useMemo(() => rng(7), []);
  const sample = (i) => 5.2 + 0.6 * Math.sin(i / 9) + (r() - 0.5) * 1.6 + (r() < 0.04 ? 1.4 : 0);
  const [pts, setPts] = useState(() => Array.from({ length: n }, (_, i) => sample(i)));
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = n;
    const id = setInterval(() => setPts((p) => [...p.slice(1), sample(t++)]), 120);
    return () => clearInterval(id);
  }, []);
  return pts;
}

function Console() {
  const pts = useWave();
  const W = 520, H = 150;
  const y = (v) => H - 8 - (v / 10) * (H - 16);
  const d = pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * W).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <div className="relative rounded-2xl border border-line-2 bg-panel shadow-[0_24px_60px_-28px_rgba(15,23,42,.25)]" aria-label="Illustration of the Veyroniq asset health console with sample data" role="img">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="size-2.5 rounded-full bg-line-2" />)}</span>
        <span className="font-mono text-xs text-muted">Line 3 · Filling &amp; capping</span>
        <span className="chip ml-auto border-warn/30 bg-warn/10 text-warn">Sample data</span>
      </div>
      <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
        <ul className="hidden border-r border-line p-3 sm:block">
          {ASSETS.map(([id, n, h]) => (
            <li key={id} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-xs ${id === "P-204" ? "bg-panel-2" : ""}`}>
              <i className={`size-2 rounded-full ${tone(h)}`} />
              <span className="flex-1 truncate"><b className="font-mono font-medium text-ink">{id}</b> <span className="text-muted">{n}</span></span>
              <span className="font-mono text-muted">{h}</span>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs"><span className="text-muted">P-204 · Vibration velocity (mm/s RMS)</span><span className="flex items-center gap-1.5 text-ok"><i className="pulse-dot size-1.5 rounded-full bg-ok" />Streaming</span></div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-32 w-full" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" x2={W} y1={y(7.1)} y2={y(7.1)} stroke="#F5B83D" strokeDasharray="4 5" strokeOpacity=".6" />
                        <path d={d} fill="none" stroke="#1F5BF0" strokeWidth="2" />
          </svg>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[["Vibration", pts[pts.length - 1].toFixed(1), "mm/s"], ["Bearing temp", "71.4", "°C"], ["Pressure", "4.2", "bar"], ["Since service", "2,140", "h"]].map(([k, v, u]) => (
              <div key={k} className="rounded-lg border border-line bg-bg-2 px-3 py-2"><p className="text-[0.68rem] text-faint">{k}</p><p className="font-mono text-sm text-ink">{v}<span className="ml-0.5 text-xs text-muted">{u}</span></p></div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-warn/30 bg-warn/[0.07] p-3">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold text-warn">Forecast · Drive-end bearing wear</p><p className="font-mono text-xs text-ink">18–26 days</p></div>
            <p className="mt-1 text-xs text-muted">Recommended: replace the drive-end bearing at the planned stop on Line 3 and check shaft alignment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.02fr_1fr]">
        <div className="rise">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-2 bg-panel/70 px-3 py-1 text-xs text-muted">
            <i className="size-1.5 rounded-full bg-cyan" />Predictive maintenance for industrial equipment
          </p>
          <h1 className="text-[clamp(2.4rem,5.6vw,4.1rem)] font-extrabold leading-[1.02]">
            Know which machine will fail — <span className="text-blue">before it stops your line.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-muted">
            Veyroniq reads vibration, temperature, pressure and maintenance history to flag abnormal machine behaviour, estimate when a failure is likely and tell your maintenance team what to fix first.
          </p>
          <p className="mt-3 text-sm text-faint">For maintenance and reliability teams in manufacturing, food processing, mining and oil &amp; gas.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn btn-primary btn-lg"><PlayCircle className="size-4" />Explore the sample workspace</Link>
            <Link to="/#contact" className="btn btn-line btn-lg">Request early access <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <div className="rise [animation-delay:120ms]"><Console /></div>
      </div>
    </section>
  );
}
