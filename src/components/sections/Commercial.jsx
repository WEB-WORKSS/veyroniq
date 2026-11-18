import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Factory, Wheat, Mountain, Flame, Radio, HardDrive, Cpu, Brain, LayoutDashboard, ShieldCheck, Users, Layers, Eye } from "lucide-react";
import { SectionHead } from "../ui/primitives.jsx";
import { aws } from "../../data/business.js";

export function Solutions() {
  const S = [
    { i: Factory, t: "Manufacturing plants", who: "Maintenance and reliability teams running motors, gearboxes, pumps and conveyors on production lines.", c: "A single stopped line idles operators and misses shipments, while technicians spend rounds checking healthy machines.", u: "Watch health by line, act on ranked alerts and plan bearing and seal work into weekly stops.", b: "Fewer emergency call-outs and work that fits the production schedule." },
    { i: Wheat, t: "Food processing", who: "Engineering teams responsible for refrigeration, mixers, fillers and packaging lines.", c: "A failing compressor or filler can force product to be held or discarded, and hygiene schedules leave little room for unplanned work.", u: "Track compressor discharge temperature and vibration trends, and schedule repairs around sanitation windows.", b: "Earlier warning on the equipment that protects product quality." },
    { i: Mountain, t: "Mining operations", who: "Site maintenance crews for crushers, conveyors, pumps and haulage support equipment.", c: "Harsh conditions accelerate wear, and one gearbox failure can idle a whole circuit far from parts and people.", u: "Follow gear-mesh vibration and oil temperature, and order parts before the failure window opens.", b: "Fewer circuit-wide stoppages and better-planned shutdowns." },
    { i: Flame, t: "Oil & gas and equipment operators", who: "Operators of pumps, compressors and rotating equipment at plants, remote sites and rented fleets.", c: "Travel to remote sites is expensive, and seal or bearing failures carry safety and environmental cost.", u: "See fleet-wide health remotely and send technicians to the highest-risk asset first.", b: "Fewer wasted trips and earlier action on safety-relevant failures." },
  ];
  return (
    <section id="solutions" className="border-y border-line bg-bg-2 py-24">
      <div className="wrap">
        <SectionHead eyebrow="Who it's for" title="Built for operations where downtime is expensive." />
        <div className="grid gap-4 md:grid-cols-2">
          {S.map((s) => (
            <article key={s.t} className="card p-6">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue/15"><s.i className="size-5 text-blue-2" /></span><h3 className="text-lg font-bold">{s.t}</h3></div>
              <p className="mt-3 text-sm text-muted">{s.who}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="font-mono text-[0.68rem] uppercase tracking-widest text-faint">Challenge</dt><dd className="mt-1 text-ink/90">{s.c}</dd></div>
                <div><dt className="font-mono text-[0.68rem] uppercase tracking-widest text-faint">How they use Veyroniq</dt><dd className="mt-1 text-ink/90">{s.u}</dd></div>
                <div><dt className="font-mono text-[0.68rem] uppercase tracking-widest text-faint">Benefit</dt><dd className="mt-1 text-ok">{s.b}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  { k: "starter", name: "Pilot", for: "One line or a small set of critical assets.", monthly: 149, annual: 124, assets: "Up to 25 monitored assets", cta: ["Request early access", "/#contact"],
    f: ["Machine health monitoring", "Alerts and anomaly flags", "Work orders and inspections", "Basic downtime reporting", "1 site · up to 5 users", "Email support"] },
  { k: "growth", name: "Plant", for: "A full plant with several lines and utilities.", monthly: 499, annual: 415, assets: "Up to 150 monitored assets", hl: true, cta: ["Choose Plant", "/#contact"],
    f: ["Everything in Pilot", "Failure-window forecasts", "Ranked maintenance recommendations", "Advanced downtime & MTBF analytics", "CSV and PDF reporting", "Up to 25 users"] },
  { k: "ent", name: "Enterprise", for: "Multi-site operators and equipment fleets.", monthly: null, assets: "Custom asset volumes", cta: ["Contact Sales", "/#contact"],
    f: ["Everything in Plant", "Multiple sites and organisation controls", "Integrations agreed during onboarding", "Enterprise onboarding", "Negotiated commercial terms"] },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const rows = [["Monitored assets", "25", "150", "Custom"], ["Sites", "1", "1", "Multiple"], ["Users", "5", "25", "Custom"], ["Health monitoring & alerts", true, true, true], ["Work orders & inspections", true, true, true], ["Failure-window forecasts", false, true, true], ["Ranked recommendations", false, true, true], ["Advanced analytics & exports", false, true, true], ["Organisation controls", false, false, true]];
  return (
    <section id="pricing" className="py-24">
      <div className="wrap">
        <SectionHead center eyebrow="Pricing" title="Priced by the assets you monitor."
          lede="Indicative launch pricing. Final pricing is being set with early-access customers, and no payment is taken today — every plan starts with an early-access conversation." />
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-xl border border-line-2 bg-panel p-1" role="group" aria-label="Billing period">
            {[["Monthly", false], ["Annual", true]].map(([l, v]) => (
              <button key={l} onClick={() => setAnnual(v)} aria-pressed={annual === v} className={`rounded-lg px-4 py-2 text-sm font-semibold ${annual === v ? "bg-blue text-white" : "text-muted"}`}>{l}{v && <span className="ml-1.5 text-xs font-medium text-ok">save ~17%</span>}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.k} className={`card relative flex flex-col p-7 ${p.hl ? "border-blue/60 shadow-[0_24px_60px_-28px_rgba(15,23,42,.25)]" : ""}`}>
              {p.hl && <span className="chip absolute -top-3 left-7 border-blue/50 bg-blue text-white">Recommended for full plants</span>}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.for}</p>
              <div className="mt-6 min-h-[76px]">
                {p.monthly ? (
                  <>
                    <p><span className="font-display text-4xl font-extrabold">${annual ? p.annual : p.monthly}</span><span className="text-muted"> /month</span></p>
                    <p className="mt-1 text-xs text-faint">{annual ? `Billed $${(p.annual * 12).toLocaleString()} annually` : "Billed monthly"}</p>
                  </>
                ) : <p className="font-display text-4xl font-extrabold">Custom</p>}
              </div>
              <p className="mb-5 text-sm font-semibold text-cyan">{p.assets}</p>
              <ul className="mb-8 space-y-2.5 text-sm">{p.f.map((x) => <li key={x} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-ok" />{x}</li>)}</ul>
              <Link to={p.cta[1]} className={`btn mt-auto ${p.hl ? "btn-primary" : "btn-line"}`}>{p.cta[0]}</Link>
            </div>
          ))}
        </div>
        <div className="mt-12 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Plan comparison</caption>
            <thead className="bg-panel"><tr><th className="th">Feature</th>{PLANS.map((p) => <th key={p.k} className="th">{p.name}</th>)}</tr></thead>
            <tbody>{rows.map(([k, ...v]) => <tr key={k}><td className="td text-muted">{k}</td>{v.map((x, i) => <td key={i} className="td">{x === true ? <Check className="size-4 text-ok" aria-label="Included" /> : x === false ? <span className="text-faint" aria-label="Not included">—</span> : x}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[["Can I buy a plan today?", "Not yet. Veyroniq is building its initial product. Plans open first to early-access teams, and pricing is confirmed with them before any billing starts."],
            ["What counts as a monitored asset?", "One machine with at least one connected sensor stream — for example a pump, motor, gearbox, fan or compressor."],
            ["Is there a free trial?", "No trial is offered yet. You can explore the full sample workspace without an account, and early-access teams work with us on their own equipment."]].map(([q, a]) => (
            <div key={q} className="rounded-2xl border border-line p-5"><h3 className="text-sm font-bold">{q}</h3><p className="mt-2 text-sm text-muted">{a}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STAGE_ICONS = { collect: Radio, store: HardDrive, process: Cpu, ai: Brain, app: LayoutDashboard };

export function AwsSection() {
  return (
    <section id="technology" className="border-y border-line bg-bg-2 py-24">
      <div className="wrap">
        <SectionHead eyebrow="Technology" title="How We Use Amazon Web Services" lede={aws.intro} />
        <ol className="grid gap-3 md:grid-cols-5" aria-label="Five-stage architecture">
          {aws.stages.map((s, i) => {
            const I = STAGE_ICONS[s.key];
            return (
              <li key={s.key} className="relative flex flex-col rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-blue/15"><I className="size-4 text-cyan" /></span><span className="font-mono text-[0.68rem] text-faint">0{i + 1}</span></div>
                <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">{s.text}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{s.services.map((x) => <span key={x} className="rounded-md border border-line-2 bg-bg-2 px-2 py-1 font-mono text-[0.66rem] text-ink">{x}</span>)}</div>
                {i < 4 && <span className="absolute -right-2.5 top-10 z-10 hidden h-0.5 w-4 bg-blue md:block" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
        <div className="mt-10 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {aws.services.map((s) => <p key={s.name} className="border-b border-line pb-3 text-sm"><b className="text-ink">{s.name}:</b> <span className="text-muted">{s.purpose}</span></p>)}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[[Eye, "Explainable alerts", "Every alert shows which signals changed and by how much, so engineers can check the reasoning."], [Users, "People make the call", "Recommendations support maintenance teams; they never trigger equipment actions automatically."], [ShieldCheck, "Plant data kept separate", "The architecture is designed to isolate each customer's data and encrypt it in transit and at rest."], [Layers, "Scales with assets", "Serverless, event-driven processing is designed to grow with the number of connected machines."]].map(([I, t, d]) => (
            <div key={t} className="rounded-2xl border border-line p-5"><I className="size-5 text-cyan" /><h3 className="mt-3 text-sm font-bold">{t}</h3><p className="mt-1.5 text-sm text-muted">{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
