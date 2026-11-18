import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo.jsx";
import { business } from "../../data/business.js";

export function Footer() {
  const li = business.facts.linkedinCompanyUrl;
  const cols = [
    ["Product", [["Product", "/#product"], ["How It Works", "/#how-it-works"], ["Sample workspace", "/dashboard"], ["Pricing", "/#pricing"]]],
    ["Solutions", [["Manufacturing", "/#solutions"], ["Food processing", "/#solutions"], ["Mining", "/#solutions"], ["Oil & gas", "/#solutions"]]],
    ["Company", [["Technology", "/#technology"], ["Team", "/#team"], ["Contact", "/#contact"], ["FAQ", "/#faq"]]],
    ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]],
  ];
  return (
    <footer className="border-t border-line bg-bg-2">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{business.oneLiner} Know which machine will fail, when, and what to fix first.</p>
          <a href={`mailto:${business.email}`} className="mt-4 inline-block text-sm text-ink hover:text-cyan">{business.email}</a>
          {li.status === "verified" && li.value && <a href={li.value} className="mt-2 block text-sm text-muted hover:text-cyan" rel="noopener">LinkedIn</a>}
        </div>
        {cols.map(([h, links]) => (
          <nav key={h} aria-label={h}>
            <h3 className="mb-4 font-mono text-[0.7rem] font-medium uppercase tracking-widest text-faint">{h}</h3>
            <ul className="space-y-2.5">{links.map(([l, to]) => <li key={l}><Link to={to} className="text-sm text-muted hover:text-ink">{l}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="wrap flex flex-col justify-between gap-2 border-t border-line py-6 text-xs text-faint sm:flex-row">
        <p>© {business.copyrightYear} {business.name}. All rights reserved.</p>
        <p>Building the initial product · Workspace demos use sample data.</p>
      </div>
    </footer>
  );
}
