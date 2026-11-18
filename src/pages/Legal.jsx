import { business } from "../data/business.js";

export function LegalPage({ title, updated, intro, sections }) {
  return (
    <article className="wrap max-w-3xl py-16 sm:py-24">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold">{title}</h1>
      <p className="mt-3 text-sm text-faint">Last updated {updated}</p>
      <p className="mt-8 leading-relaxed text-muted">{intro}</p>
      {sections.map(([h, paras]) => (
        <section key={h} className="mt-10">
          <h2 className="text-xl font-bold">{h}</h2>
          {paras.map((p, i) => Array.isArray(p)
            ? <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5 text-muted">{p.map((x) => <li key={x}>{x}</li>)}</ul>
            : <p key={i} className="mt-3 leading-relaxed text-muted">{p}</p>)}
        </section>
      ))}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Contact</h2>
        <p className="mt-3 text-muted">{business.name} · <a className="text-cyan underline" href={`mailto:${business.email}`}>{business.email}</a> · {business.url}</p>
      </section>
    </article>
  );
}

export const UPDATED = "18 November 2026";
