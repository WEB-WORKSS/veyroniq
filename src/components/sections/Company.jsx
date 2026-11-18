import { useState } from "react";
import { Mail, Linkedin, Send, CheckCircle2 } from "lucide-react";
import { SectionHead, Field, SubmitButton } from "../ui/primitives.jsx";
import { business, contact } from "../../data/business.js";
import { isEmail, isBusinessEmail } from "../../lib/utils.js";

export function Progress() {
  const P = [
    { k: "Now", t: "Design and prototype", items: ["Product workflow and dashboard design", "Interactive sample workspace", "AWS architecture definition", "Sign-in integration (Amazon Cognito) written"], on: true },
    { k: "Next", t: "Core platform build", items: ["Telemetry ingestion and storage", "First anomaly-detection models", "Working sessions with early-access plants"] },
    { k: "Then", t: "Early access release", items: ["Failure forecasting on customer assets", "Maintenance recommendations", "Pricing confirmed with early-access customers"] },
  ];
  return (
    <section id="status" className="py-24">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow mb-3">Product status</p>
          <h2 className="h2">Where Veyroniq is today.</h2>
          <p className="lede">Veyroniq is building its initial product. The sample workspace on this site is a working prototype; the data pipeline and models are being built on the proposed AWS architecture.</p>
          <div className="mt-8 rounded-2xl border border-blue/40 bg-blue/[0.07] p-6">
            <h3 className="text-lg font-bold">Bring a production line. We'll bring the models.</h3>
            <p className="mt-2 text-sm text-muted">We're looking for maintenance and reliability teams willing to share equipment data and feedback as Veyroniq is built. Early-access teams get working sessions on their own equipment, direct input into alerts and forecasts, and priority onboarding.</p>
            <a href="#contact" className="btn btn-primary mt-5">Request early access</a>
          </div>
        </div>
        <ol className="relative space-y-4 border-l border-line-2 pl-8">
          {P.map((p) => (
            <li key={p.k} className="relative">
              <span className={`absolute -left-[41px] top-1.5 size-4 rounded-full border-2 ${p.on ? "border-cyan bg-cyan/30" : "border-line-2 bg-bg"}`} />
              <div className="card p-6">
                <p className={`font-mono text-xs uppercase tracking-widest ${p.on ? "text-cyan" : "text-faint"}`}>{p.k}</p>
                <h3 className="mt-1 text-lg font-bold">{p.t}</h3>
                <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">{p.items.map((i) => <li key={i}>• {i}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section id="team" className="border-y border-line bg-bg-2 py-24">
      <div className="wrap">
        <SectionHead eyebrow="Team" title={`The Team Behind ${business.name}`}
          lede={`${business.name} is an industrial AI software company founded in ${business.facts.foundingYear.value}. It is building a predictive maintenance platform that helps manufacturers and industrial operators prevent unexpected equipment failures and reduce production downtime.`} />
        {business.founders.map((p) => (
          <article key={p.name} className="relative grid items-center gap-10 overflow-hidden rounded-[20px] border border-line-2 bg-panel p-8 shadow-[0_24px_60px_-28px_rgba(15,23,42,.25)] md:grid-cols-[auto_1fr] md:p-12">
            {p.photo
              ? <img src={p.photo} alt={p.name} className="relative size-36 rounded-[28px] object-cover md:size-40" />
              : <div className="relative grid size-28 place-items-center rounded-[24px] bg-blue font-display text-4xl font-extrabold text-ink shadow-[0_24px_60px_-28px_rgba(15,23,42,.25)] md:size-40 md:text-5xl" aria-hidden="true">{p.initials}</div>}
            <div className="relative">
              <p className="eyebrow">Meet the founder</p>
              <h3 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none">{p.name}</h3>
              <p className="mt-3 text-lg font-semibold text-cyan">{p.title}, {business.name}</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">{p.bio}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${p.email}`} className="btn btn-line"><Mail className="size-4" />{p.email}</a>
                {p.linkedin && <a href={p.linkedin} className="btn btn-line" rel="noopener" target="_blank"><Linkedin className="size-4" />LinkedIn</a>}
              </div>
            </div>
          </article>
        ))}
        <dl className="mt-6 grid overflow-hidden rounded-2xl border border-line bg-panel sm:grid-cols-2 lg:grid-cols-4">
          {[["Founded", business.facts.foundingYear.value], ["Category", business.category], ["Stage", business.stage.label], ["Company type", business.companyType]].map(([k, v]) => (
            <div key={k} className="border-line p-5 sm:border-l first:border-l-0"><dt className="font-mono text-[0.68rem] uppercase tracking-widest text-faint">{k}</dt><dd className="mt-1.5 font-display font-semibold text-ink">{v}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Faq() {
  const Q = [
    ["Is Veyroniq available today?", "Veyroniq is building its initial product. The sample workspace is an interactive prototype using fictional data. Maintenance teams can request early access to take part as the platform is built."],
    ["What data does it need?", "Readings from vibration, temperature and pressure sensors, a list of assets, and maintenance history such as past work orders and failures. Supported data sources and connection methods will be confirmed with early-access teams."],
    ["Do we need new sensors?", "Not necessarily. Many plants already collect useful readings. Where coverage is missing, adding sensors to critical assets will be discussed during onboarding."],
    ["Does the AI control our equipment?", "No. Veyroniq detects, forecasts and recommends. Maintenance teams decide what to do and when, and nothing changes how machines operate."],
    ["Where will our data be stored?", "The proposed architecture stores data on AWS, designed so each customer's data is isolated and encrypted. Hosting regions will be confirmed with early-access customers."],
  ];
  return (
    <section id="faq" className="py-24">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div><p className="eyebrow mb-3">FAQ</p><h2 className="h2">Common questions</h2></div>
        <div className="divide-y divide-line border-y border-line">
          {Q.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">{q}<span className="text-cyan transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const SIZES = ["1–50 employees", "51–200 employees", "201–1,000 employees", "1,000+ employees"];
const USES = ["Predict equipment failures", "Monitor machine health", "Prioritise maintenance work", "Reduce downtime / analyse reliability", "Early-access partnership", "Other"];

export function Contact() {
  const [v, setV] = useState({ name: "", email: "", company: "", size: "", use: "", message: "", website: "" });
  const [err, setErr] = useState({});
  const [state, setState] = useState({ status: "idle" });
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); setErr((s) => ({ ...s, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!isEmail(v.email)) e.email = "Enter a valid email address.";
    else if (!isBusinessEmail(v.email)) e.email = "Please use your work email.";
    if (!v.company.trim()) e.company = "Company is required.";
    if (!v.size) e.size = "Select a company size.";
    if (!v.use) e.use = "Select a primary use case.";
    if (v.message.length > 2000) e.message = "Please keep it under 2,000 characters.";
    setErr(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (v.website) return; // honeypot
    if (!validate()) return;
    setState({ status: "loading" });
    const payload = { name: v.name.trim(), email: v.email.trim(), company: v.company.trim(), companySize: v.size, useCase: v.use, message: v.message.trim(), source: "veyroniq.site" };
    if (contact.leadEndpoint) {
      try {
        const r = await fetch(contact.leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error(String(r.status));
        setState({ status: "sent" });
      } catch {
        setState({ status: "error", message: `We couldn't send your request. Please email ${business.email} directly.` });
      }
      return;
    }
    // No form endpoint configured: hand off to the visitor's email app with everything filled in.
    const body = `Name: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company}\nCompany size: ${payload.companySize}\nPrimary use case: ${payload.useCase}\n\n${payload.message}`;
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(`Veyroniq inquiry: ${payload.company}`)}&body=${encodeURIComponent(body)}`;
    setState({ status: "mailto" });
  };

  return (
    <section id="contact" className="border-t border-line bg-bg-2 py-24">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <h2 className="h2">Talk to us about your equipment.</h2>
          <p className="lede">Request early access, ask about pricing or tell us which failures cost you the most. Messages go straight to the founder.</p>
          <a href={`mailto:${business.email}`} className="mt-8 flex items-center gap-3 rounded-2xl border border-line p-5 hover:border-cyan">
            <Mail className="size-5 text-cyan" /><span><span className="block text-xs text-faint">Email</span><span className="font-semibold text-ink">{business.email}</span></span>
          </a>
        </div>
        <div className="card p-6 md:p-8">
          {state.status === "sent" ? (
            <div className="py-10 text-center"><CheckCircle2 className="mx-auto size-10 text-ok" /><h3 className="mt-4 text-xl font-bold">Thanks — your request was sent.</h3><p className="mt-2 text-sm text-muted">We'll reply to {v.email}.</p></div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
              <input type="text" name="website" value={v.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <Field label="Full name" error={err.name}>{(a) => <input {...a} className="input" autoComplete="name" value={v.name} onChange={set("name")} />}</Field>
              <Field label="Business email" error={err.email}>{(a) => <input {...a} type="email" className="input" autoComplete="email" value={v.email} onChange={set("email")} />}</Field>
              <Field label="Company" error={err.company}>{(a) => <input {...a} className="input" autoComplete="organization" value={v.company} onChange={set("company")} />}</Field>
              <Field label="Company size" error={err.size}>{(a) => <select {...a} className="input" value={v.size} onChange={set("size")}><option value="">Select</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select>}</Field>
              <Field label="Primary use case" error={err.use} className="sm:col-span-2">{(a) => <select {...a} className="input" value={v.use} onChange={set("use")}><option value="">Select</option>{USES.map((s) => <option key={s}>{s}</option>)}</select>}</Field>
              <Field label="Message (optional)" error={err.message} hint="Which equipment failures cost you the most today?" className="sm:col-span-2">{(a) => <textarea {...a} rows={4} className="input" value={v.message} onChange={set("message")} />}</Field>
              {state.status === "error" && <p role="alert" className="text-sm text-crit sm:col-span-2">{state.message}</p>}
              {state.status === "mailto" && <p role="status" className="text-sm text-muted sm:col-span-2">Your email app should have opened with the message ready — press send there. If nothing opened, email <a className="text-cyan underline" href={`mailto:${business.email}`}>{business.email}</a>.</p>}
              <div className="sm:col-span-2"><SubmitButton loading={state.status === "loading"}><Send className="size-4" />{contact.leadEndpoint ? "Send request" : "Continue in email"}</SubmitButton></div>
              <p className="text-xs text-faint sm:col-span-2">We use these details only to reply to you. See our <a href="/privacy" className="underline">Privacy Policy</a>.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
