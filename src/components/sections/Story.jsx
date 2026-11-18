import { Activity, AlarmClock, ListChecks, BarChart3, Wrench, CalendarClock, Gauge, Cable, Brain, ClipboardCheck } from "lucide-react";
import { SectionHead } from "../ui/primitives.jsx";

export function Highlights() {
  const items = [
    [Activity, "Multi-signal analysis", "Vibration, temperature, pressure and service history read together, not in isolation."],
    [AlarmClock, "Failure-window forecasts", "An estimated time range for likely failure, so work fits planned stops."],
    [ListChecks, "Ranked recommendations", "What to inspect or replace first, ranked by risk to production."],
    [BarChart3, "Downtime analytics", "Where lost hours come from, by asset, line and cause."],
  ];
  return (
    <section aria-label="Capability highlights" className="border-y border-line bg-bg-2">
      <div className="wrap grid divide-line sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
        {items.map(([I, t, d]) => (
          <div key={t} className="px-2 py-8 lg:px-7">
            <I className="size-5 text-cyan" />
            <h3 className="mt-3 text-base font-bold">{t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Problem() {
  const cols = [
    { k: "Reactive", t: "Fix it when it breaks", tone: "text-crit", items: ["Unplanned stops mid-shift", "Expedited parts and call-out labour", "Secondary damage to connected equipment", "Scrap and missed orders"] },
    { k: "Preventive", t: "Service it on a schedule", tone: "text-warn", items: ["Parts replaced with useful life left", "Planned work that wasn't needed", "Failures still slip between intervals", "Inspection rounds that don't scale"] },
    { k: "Predictive with Veyroniq", t: "Service it when the data says so", tone: "text-ok", hl: true, items: ["Early warning from changing machine behaviour", "Work planned into scheduled stops", "Parts ordered ahead of need", "Technicians sent to the highest-risk asset first"] },
  ];
  const cases = [
    ["Food processing", "A refrigeration compressor during peak production", "A failing compressor can force product to be held or discarded. Rising discharge temperature and vibration often show weeks before it trips."],
    ["Mining", "A conveyor gearbox on the main haul line", "One gearbox failure can idle the whole circuit. Gear-mesh vibration and oil temperature trends show wear long before teeth break."],
    ["Oil & gas", "A transfer pump seal at a remote site", "Seal leaks bring safety, environmental and travel costs. Pressure fluctuations and bearing temperature give advance notice."],
  ];
  return (
    <section id="problem" className="py-24">
      <div className="wrap">
        <SectionHead eyebrow="The problem" title="Most maintenance is still either too late or too early."
          lede="Run-to-failure means a stopped line, emergency parts and overtime. Calendar-based servicing replaces components that still had months of life, and still misses failures that develop between inspections. Neither scales as plants add equipment while maintenance headcount stays flat." />
        <div className="grid gap-4 md:grid-cols-3">
          {cols.map((c) => (
            <div key={c.k} className={`card p-6 ${c.hl ? "border-blue/40 bg-blue/[0.03]" : ""}`}>
              <p className={`font-mono text-xs uppercase tracking-widest ${c.tone}`}>{c.k}</p>
              <h3 className="mt-2 text-xl font-bold">{c.t}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">{c.items.map((i) => <li key={i} className="flex gap-2"><span className={c.tone}>•</span>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cases.map(([ind, t, d]) => (
            <article key={ind} className="rounded-2xl border border-line p-6">
              <p className="eyebrow">{ind}</p>
              <h3 className="mt-2 text-base font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HealthGrid() {
  const rows = [["Line 1", "ookko"], ["Line 2", "ooowo"], ["Line 3", "wookc"], ["Utilities", "oowxc"]];
  const c = { o: "bg-ok/80", k: "bg-ok/50", w: "bg-warn", c: "bg-crit", x: "bg-off" };
  return (
    <div className="space-y-2">
      {rows.map(([l, s]) => (
        <div key={l} className="flex items-center gap-3"><span className="w-16 font-mono text-[0.7rem] text-faint">{l}</span>
          <div className="flex flex-1 gap-1.5">{s.split("").map((k, i) => <i key={i} className={`h-7 flex-1 rounded-md ${c[k]}`} />)}</div></div>
      ))}
      <div className="flex gap-4 pt-2 text-[0.7rem] text-muted">{[["bg-ok/80", "Healthy"], ["bg-warn", "Watch"], ["bg-crit", "Act"], ["bg-off", "Offline"]].map(([b, l]) => <span key={l} className="flex items-center gap-1.5"><i className={`size-2 rounded-sm ${b}`} />{l}</span>)}</div>
    </div>
  );
}

function AnomalyChart() {
  const v = "M0 70 C40 68 60 72 90 66 S150 64 180 62 S240 50 270 40 S320 22 360 16";
  const t = "M0 80 C50 79 80 80 110 77 S170 76 200 70 S250 58 280 50 S330 40 360 34";
  return (
    <div>
      <svg viewBox="0 0 360 100" className="h-28 w-full" aria-hidden="true">
        <rect x="230" y="0" width="130" height="100" fill="#F2545B" fillOpacity=".07" />
        <path d={v} fill="none" stroke="#5B8CFF" strokeWidth="2.2" /><path d={t} fill="none" stroke="#22D3EE" strokeWidth="2.2" strokeDasharray="5 4" />
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs"><span className="flex items-center gap-1.5 text-muted"><i className="h-0.5 w-4 bg-blue-2" />Vibration</span><span className="flex items-center gap-1.5 text-muted"><i className="h-0.5 w-4 bg-cyan" />Bearing temp</span><span className="ml-auto font-mono text-crit">Anomaly score 0.87</span></div>
      <p className="mt-2 text-xs text-faint">Correlated rise in vibration and bearing temperature at constant load</p>
    </div>
  );
}

function Recommendation() {
  return (
    <div className="rounded-xl border border-line bg-bg-2 p-4 text-sm">
      <div className="flex items-center justify-between"><span className="font-mono text-xs text-muted">REC-0417 · C-402 Air compressor</span><span className="chip border-crit/30 bg-crit/10 text-crit">Priority 1</span></div>
      <p className="mt-2 font-semibold text-ink">Likely cause: inlet valve wear causing overheating</p>
      <ul className="mt-2 space-y-1.5 text-muted">{["Inspect inlet valve and seat for wear", "Check intercooler for fouling", "Verify discharge temperature after service"].map((x) => <li key={x} className="flex gap-2"><ClipboardCheck className="mt-0.5 size-3.5 shrink-0 text-cyan" />{x}</li>)}</ul>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs"><div><p className="text-faint">Parts</p><p>Valve kit, gaskets</p></div><div><p className="text-faint">Est. duration</p><p>3.5 h</p></div><div><p className="text-faint">Last similar</p><p>14 months ago</p></div></div>
    </div>
  );
}

function ForecastTimeline() {
  return (
    <div className="text-xs">
      <div className="relative h-14 rounded-lg border border-line bg-bg-2">
        <div className="absolute inset-y-2 left-[46%] w-[20%] rounded-md bg-warn/25 ring-1 ring-warn/50" />
        <div className="absolute inset-y-0 left-[38%] w-px bg-cyan" /><span className="absolute -top-5 left-[38%] -translate-x-1/2 text-cyan">Planned stop</span>
        <span className="absolute bottom-1 left-2 text-faint">Today</span><span className="absolute bottom-1 right-2 text-faint">+45 d</span>
      </div>
      <p className="mt-3 text-muted"><b className="text-ink">P-204 Transfer pump</b> · drive-end bearing wear · likely in <b className="text-warn">18–26 days</b> · confidence medium-high</p>
    </div>
  );
}

function DowntimeBars() {
  const d = [["Bearing failure", 41], ["Seal leakage", 28], ["Motor overheating", 19], ["Belt / coupling", 13], ["Electrical", 8]];
  return (
    <div><p className="mb-3 text-xs text-faint">Downtime by cause · last 90 days (sample)</p>
      <div className="space-y-2">{d.map(([k, h]) => <div key={k} className="grid grid-cols-[120px_1fr_40px] items-center gap-2 text-xs"><span className="text-muted">{k}</span><div className="h-2 rounded bg-line"><div className="h-2 rounded bg-blue" style={{ width: `${(h / 41) * 100}%` }} /></div><span className="text-right font-mono">{h} h</span></div>)}</div>
    </div>
  );
}

export function Features() {
  const F = [
    { n: "01", icon: Gauge, t: "Real-time machine health monitoring", d: "Every connected asset gets a health score built from its sensor readings and operating context, shown by line, area and site.", o: "Supervisors see the state of the floor at a glance, without walking it or reading raw tags.", v: <HealthGrid />, flow: "Feeds anomaly detection" },
    { n: "02", icon: Brain, t: "AI-powered anomaly detection", d: "Models learn each machine's normal behaviour across load and speed, then flag readings and combinations of readings that drift away from it — even when no single value has crossed a fixed alarm.", o: "Earlier warnings with fewer nuisance alarms than static thresholds.", v: <AnomalyChart />, flow: "Triggers a forecast" },
    { n: "03", icon: CalendarClock, t: "Failure-window forecasting", d: "For degrading components, Veyroniq estimates a likely failure window with a confidence range, based on sensor trends and past failures.", o: "Planners move work into scheduled shutdowns instead of reacting to breakdowns.", v: <ForecastTimeline />, flow: "Becomes a recommendation" },
    { n: "04", icon: Wrench, t: "Intelligent maintenance recommendations", d: "Each alert becomes a plain-language recommendation: the likely fault, what to check, the parts usually needed and typical duration — drawing on the asset's own maintenance history.", o: "Technicians arrive knowing what to look for, with the right parts.", v: <Recommendation />, flow: "Turns into a work order" },
    { n: "05", icon: BarChart3, t: "Downtime & performance analytics", d: "Track downtime, availability, mean time between failures and maintenance effort by asset, line and failure cause.", o: "Reliability and capital planning grounded in the plant's own data.", v: <DowntimeBars />, flow: "Closes the loop" },
  ];
  return (
    <section id="product" className="border-y border-line bg-bg-2 py-24">
      <div className="wrap">
        <SectionHead eyebrow="Product" title="From sensor signal to scheduled work order."
          lede="Five capabilities in one workflow: monitor every asset, detect what's abnormal, forecast what it means, recommend the fix and measure the result. The sample workspace lets you try the monitoring, alert, work-order and analytics screens today; detection and forecasting models are being built." />
        <div className="space-y-5">
          {F.map((f, i) => (
            <article key={f.n} className={`card grid items-center gap-8 p-6 md:p-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="flex items-center gap-3"><span className="font-mono text-xs text-faint">{f.n}</span><f.icon className="size-5 text-cyan" /></div>
                <h3 className="mt-3 text-2xl font-bold">{f.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{f.d}</p>
                <p className="mt-4 text-sm"><span className="font-semibold text-ink">Outcome: </span><span className="text-muted">{f.o}</span></p>
                <p className="mt-4 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-faint"><Cable className="size-3.5" />{f.flow}</p>
              </div>
              <div className="rounded-xl border border-line bg-bg/60 p-5">{f.v}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const S = [
    ["Connect equipment", "Sensor data from vibration, temperature and pressure sensors is streamed from the plant, alongside asset lists and maintenance records."],
    ["Learn normal behaviour", "Readings are stored, cleaned and aligned with operating context, and baseline models are built for each asset."],
    ["Detect and forecast", "New data is scored continuously for anomalies, and degrading components get an estimated failure window."],
    ["Recommend and act", "Maintenance teams receive ranked recommendations, schedule the work and close the loop by recording what they found."],
  ];
  return (
    <section id="how-it-works" className="py-24">
      <div className="wrap">
        <SectionHead eyebrow="How it works" title="Four steps from machine to decision." />
        <ol className="grid gap-4 md:grid-cols-4">
          {S.map(([t, d], i) => (
            <li key={t} className="relative rounded-2xl border border-line p-6">
              <span className="font-display text-4xl font-extrabold text-line-2">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              {i < 3 && <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-blue md:block" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
