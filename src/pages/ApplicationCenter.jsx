import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Palette, Linkedin, ClipboardList, Network, Users, FileText, ListChecks, Download, Printer, RefreshCw, Copy, AlertTriangle, CheckCircle2, CircleDashed, ShieldAlert, Lock } from "lucide-react";
import { LogoMark } from "../components/ui/Logo.jsx";
import { Chip, CopyButton, Spinner } from "../components/ui/primitives.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { business, aws, openItems } from "../data/business.js";
import { linkedin } from "../data/linkedin.js";
import { generateAnswers, answersAsText, businessDetails } from "../data/aws-answers.js";
import { download, copyText, cn } from "../lib/utils.js";
import { useToast } from "../hooks/useToast.jsx";

const SECTIONS = [
  ["overview", "Business overview", Building2], ["brand", "Brand assets", Palette], ["linkedin", "LinkedIn profile kit", Linkedin],
  ["aws-answers", "AWS Activate application", ClipboardList], ["architecture", "AWS architecture", Network], ["team", "Founder & team", Users],
  ["info", "Business information", FileText], ["checklist", "Readiness checklist", ListChecks], ["downloads", "Downloads & exports", Download],
];

const STATUS = { verified: ["healthy", CheckCircle2, "Verified"], assumed: ["warning", CircleDashed, "Confirm"], missing: ["critical", AlertTriangle, "Missing"] };
const StatusChip = ({ s }) => { const [tone, I, l] = STATUS[s] || STATUS.assumed; return <Chip tone={tone}><I className="size-3" />{l}</Chip>; };

const CHECKS = [
  ["site", "Website publicly accessible at www.veyroniq.site"], ["domain", "Business domain configured (veyroniq.site)"], ["email", "Business email verified (fawaz@veyroniq.site)"],
  ["founder", "Founder identity consistent across site, LinkedIn and AWS"], ["linkedin", "LinkedIn company page created"], ["stage", "Product stage accurate (Ideating/building initial product)"],
  ["account", "AWS account details match the business record"], ["services", "AWS services described as proposed, not deployed"], ["answers", "All 14 application answers reviewed"],
  ["docs", "Supporting documents available (incorporation, ID if requested)"],
];

function Block({ id, title, icon: I, children, actions }) {
  return (
    <section id={id} className="card scroll-mt-24 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2.5 text-xl font-bold"><I className="size-5 text-cyan" />{title}</h2><div className="no-print flex flex-wrap gap-2">{actions}</div></div>
      {children}
    </section>
  );
}

function Row({ k, v, copy = true }) {
  return (
    <div className="grid gap-2 border-t border-line py-3 first:border-0 sm:grid-cols-[200px_1fr_auto] sm:items-start">
      <dt className="text-sm text-muted">{k}</dt><dd className="whitespace-pre-line text-sm text-ink">{v}</dd>
      {copy && v ? <CopyButton text={String(v)} className="no-print justify-self-start" /> : <span />}
    </div>
  );
}

function useChecklist() {
  const KEY = "vq.app.checklist";
  const [s, setS] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } });
  const toggle = (k) => setS((p) => { const n = { ...p, [k]: p[k] ? null : { at: new Date().toISOString() } }; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} return n; });
  return [s, toggle];
}

export default function ApplicationCenter() {
  const { user, ready, configured } = useAuth();
  const toast = useToast();
  const [seed, setSeed] = useState(0);
  const answers = useMemo(() => generateAnswers(), [seed]);
  const [checks, toggle] = useChecklist();
  const open = openItems();
  const issues = answers.flatMap((a) => a.issues);

  // With Cognito configured, only members of the admin group may open /app.
  // NOTE: real protection also requires serving this build only behind authentication (see README).
  if (configured && !ready) return <div className="grid min-h-screen place-items-center"><Spinner /></div>;
  if (configured && !user?.isAdmin) return (
    <div className="grid min-h-screen place-items-center p-6 text-center"><div><Lock className="mx-auto size-8 text-faint" /><h1 className="mt-4 text-2xl font-bold">Administrators only</h1><p className="mt-2 text-muted">Sign in with an administrator account to continue.</p><Link to="/login" state={{ from: "/app" }} className="btn btn-primary mt-6">Sign in</Link></div></div>
  );

  const copyAll = async () => { if (await copyText(answersAsText(answers))) toast("All answers copied."); };
  const lkText = `Name: ${linkedin.name}\nWebsite: ${linkedin.website}\nIndustry: ${linkedin.industry}\nCompany size: ${linkedin.companySize}\nCompany type: ${linkedin.companyType}\nFounded: ${linkedin.founded}\nHeadquarters: ${linkedin.headquarters}\nPublic URL: linkedin.com/company/${linkedin.slug} (unconfirmed)\n\nTagline:\n${linkedin.tagline}\n\nOverview:\n${linkedin.overview}\n\nSpecialties:\n${linkedin.specialties.join(", ")}`;

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center gap-3"><Link to="/" aria-label="Home"><LogoMark /></Link><span className="font-display font-extrabold">Application center</span><Chip tone="critical" className="ml-2"><ShieldAlert className="size-3" />Private · not linked publicly</Chip>
          <div className="ml-auto hidden gap-2 sm:flex"><button className="btn btn-line" onClick={copyAll}><Copy className="size-4" />Copy all answers</button><button className="btn btn-primary" onClick={() => window.print()}><Printer className="size-4" />Print summary</button></div></div>
      </header>
      <div className="wrap grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="no-print top-24 h-max space-y-0.5 lg:sticky" aria-label="Sections">
          {SECTIONS.map(([id, l, I]) => <a key={id} href={`#${id}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-panel hover:text-ink"><I className="size-4" />{l}</a>)}
        </nav>
        <div className="print-area min-w-0 space-y-6">
          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card p-5"><p className="text-sm text-muted">Answers ready</p><p className="font-display text-3xl font-extrabold">{answers.filter((a) => !a.issues.length).length}/14</p></div>
            <div className="card p-5"><p className="text-sm text-muted">Facts to confirm</p><p className="font-display text-3xl font-extrabold text-warn">{open.length}</p></div>
            <div className="card p-5"><p className="text-sm text-muted">Checklist complete</p><p className="font-display text-3xl font-extrabold">{CHECKS.filter(([k]) => checks[k]).length}/{CHECKS.length}</p></div>
          </div>

          <Block id="overview" title="Business overview" icon={Building2}>
            <dl><Row k="Company" v={business.name} /><Row k="Website" v={business.url} /><Row k="Email" v={business.email} /><Row k="One-liner" v={business.oneLiner} /><Row k="Positioning" v={business.positioning} /><Row k="Problem" v={business.problem} /><Row k="How it works" v={business.howItWorks} /><Row k="Stage" v={`${business.stage.value} — ${business.stage.evidence}`} /></dl>
            <h3 className="mt-6 text-sm font-bold">Feature classification</h3>
            <div className="mt-3 flex flex-wrap gap-2">{business.features.map((f) => <Chip key={f.name} tone={f.status === "implemented" ? "healthy" : f.status === "prototype" ? "info" : f.status === "planned" ? "neutral" : "warning"}>{f.name} · {f.status}</Chip>)}</div>
          </Block>

          <Block id="brand" title="Brand assets" icon={Palette}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Logo (SVG)", "/assets/logo.svg"], ["Logo, transparent (PNG)", "/assets/logo-transparent.png"], ["Favicon (SVG)", "/favicon.svg"]].map(([l, src]) => (
                <figure key={l} className="rounded-xl border border-line p-4"><div className="grid h-28 place-items-center rounded-lg bg-panel-2"><img src={src} alt={l} className="max-h-20 max-w-[85%]" /></div><figcaption className="mt-3 flex items-center justify-between text-sm">{l}<a href={src} download className="no-print btn btn-line px-2.5 py-1.5 text-xs"><Download className="size-3.5" />Download</a></figcaption></figure>
              ))}
            </div>
            <figure className="mt-4 rounded-xl border border-line p-4"><img src="/assets/linkedin-banner.png" alt="LinkedIn banner" className="w-full rounded-lg" /><figcaption className="mt-3 flex items-center justify-between text-sm">LinkedIn banner · 1584 × 396<a href="/assets/linkedin-banner.png" download className="no-print btn btn-line px-2.5 py-1.5 text-xs"><Download className="size-3.5" />Download</a></figcaption></figure>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {[["Background", "#070D1A"], ["Panel", "#0E1A30"], ["Blue", "#2F6BFF"], ["Cyan", "#22D3EE"], ["Healthy", "#2DD4A4"], ["Critical", "#F2545B"]].map(([n, c]) => (
                <button key={n} onClick={async () => { await copyText(c); toast(`${c} copied`); }} className="text-left"><span className="block h-14 rounded-lg border border-line" style={{ background: c }} /><span className="mt-1.5 block text-xs">{n}</span><span className="font-mono text-[0.7rem] text-faint">{c}</span></button>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">Typography: <b className="font-display text-ink">Archivo</b> (headings, 600–800) · <b className="text-ink">Inter</b> (body, 400–600) · <b className="font-mono text-ink">JetBrains Mono</b> (labels, data). All from Google Fonts.</p>
          </Block>

          <Block id="linkedin" title="LinkedIn profile kit" icon={Linkedin} actions={<CopyButton text={lkText} label="Copy full kit" />}>
            <dl>
              <Row k="Company name" v={linkedin.name} /><Row k="Website" v={linkedin.website} /><Row k="Industry" v={linkedin.industry} /><Row k="Company type" v={linkedin.companyType} />
              <Row k="Company size" v={`${linkedin.companySize}\n${linkedin.companySizeNote}`} /><Row k="Founded" v={linkedin.founded} /><Row k="Headquarters" v={linkedin.headquarters} />
              <Row k="Suggested public URL" v={`linkedin.com/company/${linkedin.slug}\nAlternatives: ${linkedin.slugAlternatives.join(", ")}\n${linkedin.slugStatus}`} />
              <Row k={`Tagline (${linkedin.tagline.length}/120)`} v={linkedin.tagline} />
              <Row k={`Overview (${linkedin.overview.length}/2000)`} v={linkedin.overview} />
              <Row k={`Specialties (${linkedin.specialties.length}/20)`} v={linkedin.specialties.join(", ")} />
              <Row k="Founder" v={`${linkedin.founder.name} — ${linkedin.founder.title}\n${linkedin.founder.email}\nLinkedIn: ${linkedin.founder.linkedin}`} />
            </dl>
          </Block>

          <Block id="aws-answers" title="AWS Activate application" icon={ClipboardList}
            actions={<><button className="btn btn-line" onClick={copyAll}><Copy className="size-4" />Copy all</button><button className="btn btn-line" onClick={() => download("veyroniq-aws-activate-answers.txt", answersAsText(answers))}><Download className="size-4" />Download</button><button className="btn btn-line" onClick={() => window.print()}><Printer className="size-4" />Print</button><button className="btn btn-line" onClick={() => { setSeed((s) => s + 1); toast("Answers regenerated from the business record."); }}><RefreshCw className="size-4" />Regenerate</button><a href="#info" className="btn btn-line"><AlertTriangle className="size-4" />Review missing info</a></>}>
            {issues.length > 0 && <div role="alert" className="mb-5 rounded-xl border border-crit/30 bg-crit/10 p-4 text-sm text-crit">{issues.map((i) => <p key={i}>{i}</p>)}</div>}
            <ol className="space-y-4">
              {answers.map((a) => (
                <li key={a.n} className="rounded-xl border border-line p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-semibold"><span className="mr-2 font-mono text-cyan">Q{a.n}</span>{a.q}</h3>
                    <div className="flex items-center gap-2"><StatusChip s={a.status} /><CopyButton text={Array.isArray(a.answer) ? a.answer.join("\n") : a.answer} className="no-print" /></div>
                  </div>
                  {Array.isArray(a.answer) ? (
                    <ul className="mt-3 flex flex-wrap gap-2">{a.answer.map((x) => <li key={x} className="flex items-center gap-1.5 rounded-lg border border-line-2 bg-bg-2 py-1 pl-3 pr-1 text-sm">{x}<button className="no-print rounded p-1 text-faint hover:text-ink" aria-label={`Copy ${x}`} onClick={async () => { await copyText(x); toast(`Copied “${x}”`); }}><Copy className="size-3" /></button></li>)}</ul>
                  ) : <p className="mt-3 rounded-lg bg-bg-2 px-3 py-2.5 text-sm text-ink">{a.answer}</p>}
                  {a.chars != null && <p className={cn("mt-2 font-mono text-xs", a.chars > 250 || a.chars < 30 ? "text-crit" : "text-ok")}>{a.chars} / 250 characters (target 180–240)</p>}
                  <p className="mt-3 text-sm text-muted"><b className="text-ink">Why: </b>{a.reason}</p>
                  {a.singleFallback && <p className="mt-1 text-xs text-faint">Single-select fallback: {a.singleFallback}</p>}
                  {a.note && <p className="mt-1 text-xs text-warn">{a.note}</p>}
                </li>
              ))}
            </ol>
          </Block>

          <Block id="architecture" title="AWS architecture" icon={Network}>
            <p className="text-sm text-muted">{aws.intro}</p>
            <ol className="mt-5 grid gap-2 md:grid-cols-5">{aws.stages.map((s, i) => <li key={s.key} className="rounded-xl border border-line p-4"><p className="font-mono text-[0.68rem] text-faint">0{i + 1}</p><p className="mt-1 text-sm font-bold">{s.title}</p><p className="mt-2 text-xs text-cyan">{s.services.join(" · ")}</p></li>)}</ol>
            <table className="mt-5 w-full text-sm"><thead><tr><th className="th">Service</th><th className="th">Purpose</th><th className="th">Status</th></tr></thead>
              <tbody>{aws.services.map((s) => <tr key={s.name}><td className="td font-medium">{s.name}</td><td className="td text-muted">{s.purpose}{s.note && <span className="block text-xs text-faint">{s.note}</span>}</td><td className="td"><Chip tone={s.status === "deployed" ? "healthy" : s.status === "in-progress" ? "warning" : "neutral"}>{s.status === "in-progress" ? "Being implemented" : s.status === "deployed" ? "Deployed" : "Proposed"}</Chip></td></tr>)}</tbody></table>
            <p className="mt-4 text-sm text-muted"><b className="text-ink">Technology stack: </b>{aws.stack.join(", ")}</p>
          </Block>

          <Block id="team" title="Founder & team" icon={Users}>
            {business.founders.map((f) => <dl key={f.name}><Row k="Name" v={f.name} /><Row k="Title" v={f.title} /><Row k="Email" v={f.email} /><Row k="LinkedIn" v={f.linkedin || "Not added yet — add to business.js to show it publicly"} copy={!!f.linkedin} /><Row k="Bio" v={`${f.bio}\n(Status: ${f.bioStatus} — confirm wording)`} /></dl>)}
          </Block>

          <Block id="info" title="Business information" icon={FileText}>
            <dl>{businessDetails().map(([k, v]) => <Row key={k} k={k} v={v} />)}</dl>
            <h3 className="mt-6 text-sm font-bold">Facts to confirm before submitting</h3>
            <ul className="mt-3 space-y-2">{open.map((o) => <li key={o.key} className="flex flex-wrap items-start gap-3 rounded-lg border border-line px-4 py-3 text-sm"><StatusChip s={o.status} /><span className="font-mono text-xs text-muted">{o.key}</span><span className="flex-1">{o.value ? <b className="text-ink">{o.value}. </b> : null}<span className="text-muted">{o.note}</span></span></li>)}</ul>
            <p className="mt-4 text-xs text-faint">Legal review also needed: governing law, legal entity name and data-hosting region for the Privacy Policy and Terms.</p>
          </Block>

          <Block id="checklist" title="Application readiness checklist" icon={ListChecks}>
            <p className="mb-4 text-sm text-muted">Tick an item only when you've checked it yourself. Saved in this browser.</p>
            <ul className="space-y-2">{CHECKS.map(([k, l]) => (
              <li key={k}><label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm hover:border-line-2"><input type="checkbox" className="size-4 accent-blue" checked={!!checks[k]} onChange={() => toggle(k)} /><span className={checks[k] ? "text-muted line-through" : ""}>{l}</span>{checks[k] && <span className="ml-auto text-xs text-faint">{new Date(checks[k].at).toLocaleDateString()}</span>}</label></li>
            ))}</ul>
          </Block>

          <Block id="downloads" title="Downloads & exports" icon={Download}>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-line" onClick={() => download("veyroniq-aws-activate-answers.txt", answersAsText(answers))}><Download className="size-4" />AWS answers (.txt)</button>
              <button className="btn btn-line" onClick={() => download("veyroniq-linkedin-kit.txt", lkText)}><Download className="size-4" />LinkedIn kit (.txt)</button>
              <button className="btn btn-line" onClick={() => download("veyroniq-business-record.json", JSON.stringify({ business, aws, linkedin }, null, 2), "application/json")}><Download className="size-4" />Business record (.json)</button>
              <a className="btn btn-line" href="/assets/logo.svg" download><Download className="size-4" />Logo</a>
              <a className="btn btn-line" href="/assets/linkedin-banner.png" download><Download className="size-4" />LinkedIn banner</a>
              <button className="btn btn-primary" onClick={() => window.print()}><Printer className="size-4" />Print full summary</button>
            </div>
            <p className="mt-4 text-xs text-faint">No credentials, keys or identity documents are stored on this page.</p>
          </Block>
        </div>
      </div>
    </div>
  );
}
