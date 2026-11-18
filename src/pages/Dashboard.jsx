import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { LayoutGrid, Boxes, BellRing, ClipboardList, ClipboardCheck, FileBarChart, History, Settings as Cog, LogOut, Search, Menu, X, ChevronsUpDown } from "lucide-react";
import { LogoMark } from "../components/ui/Logo.jsx";
import { Chip, Spinner } from "../components/ui/primitives.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useWorkspace } from "../hooks/useWorkspace.js";
import { Assets, WorkOrders, Inspections } from "../components/dashboard/Records.jsx";
import { Overview, Alerts, Reports, Activity, Settings } from "../components/dashboard/Panels.jsx";
import { SAMPLE_WORKSPACE } from "../data/product-data.js";
import { cn } from "../lib/utils.js";

const NAV = [
  ["overview", "Overview", LayoutGrid], ["assets", "Assets", Boxes], ["alerts", "Alerts", BellRing], ["work-orders", "Work orders", ClipboardList],
  ["inspections", "Inspections", ClipboardCheck], ["reports", "Reports", FileBarChart], ["activity", "Activity", History], ["settings", "Settings", Cog],
];

export default function Dashboard() {
  const { user, ready, configured, signOut } = useAuth();
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const ws = useWorkspace();
  const [side, setSide] = useState(false);
  const [bell, setBell] = useState(false);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState("");
  const bellRef = useRef(null);
  const view = NAV.some(([k]) => k === params.get("view")) ? params.get("view") : "overview";

  useEffect(() => { setSide(false); }, [view]);
  useEffect(() => { if (!bell) return; const c = (e) => !bellRef.current?.contains(e.target) && setBell(false); document.addEventListener("mousedown", c); return () => document.removeEventListener("mousedown", c); }, [bell]);

  if (configured && ready && !user) return <Navigate to="/login" state={{ from: "/dashboard" }} replace />;
  if (!ready || (!ws.data && !ws.error)) return <div className="grid min-h-screen place-items-center"><Spinner className="size-6 text-muted" /></div>;
  if (ws.error) return <div className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-lg font-bold">We couldn't load your workspace.</p><p className="mt-1 text-sm text-muted">{ws.error}</p><button className="btn btn-primary mt-5" onClick={() => location.reload()}>Try again</button></div></div>;

  const go = (v, assetQuery = "") => { setFocus(assetQuery); setParams(v === "overview" ? {} : { view: v }); };
  const openAlerts = ws.data.alerts.filter((a) => a.status === "open");
  const wsName = ws.profile?.workspace || SAMPLE_WORKSPACE.name;
  const doSignOut = async () => { await signOut(); nav("/"); };
  const search = (e) => { e.preventDefault(); if (q.trim()) { go("assets", q.trim()); setQ(""); } };

  const panel = {
    overview: <Overview ws={ws} go={go} />, assets: <Assets ws={ws} initialQuery={focus} />, alerts: <Alerts ws={ws} go={go} />,
    "work-orders": <WorkOrders ws={ws} />, inspections: <Inspections ws={ws} />, reports: <Reports ws={ws} />, activity: <Activity ws={ws} />,
    settings: <Settings ws={ws} user={user} configured={configured} onSignOut={doSignOut} />,
  }[view];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className={cn("no-print fixed inset-y-0 left-0 z-[70] flex w-[248px] flex-col border-r border-line bg-bg-2 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", side ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-2.5 px-4"><Link to="/" aria-label="Veyroniq home"><LogoMark /></Link><span className="font-display text-sm font-extrabold tracking-[0.16em]">VEYRONIQ</span><button className="btn btn-ghost ml-auto p-1.5 lg:hidden" aria-label="Close menu" onClick={() => setSide(false)}><X className="size-4" /></button></div>
        <button className="mx-3 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-left text-xs hover:border-line-2" onClick={() => go("settings")} title="Workspace settings">
          <span className="grid size-6 place-items-center rounded bg-blue/20 font-bold text-blue-2">{wsName[0]}</span><span className="flex-1 truncate">{wsName}</span><ChevronsUpDown className="size-3.5 text-faint" />
        </button>
        <nav className="mt-4 flex-1 space-y-0.5 px-3" aria-label="Workspace">
          {NAV.map(([k, l, I]) => (
            <button key={k} onClick={() => go(k)} aria-current={view === k ? "page" : undefined} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition", view === k ? "bg-blue/15 text-white" : "text-muted hover:bg-panel hover:text-ink")}>
              <I className="size-4" />{l}{k === "alerts" && openAlerts.length > 0 && <span className="ml-auto rounded-full bg-crit/20 px-1.5 text-[0.68rem] font-semibold text-crit">{openAlerts.length}</span>}
            </button>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          {ws.mode === "local" && <p className="mb-3 rounded-lg bg-warn/10 px-3 py-2 text-[0.72rem] text-warn">Sample workspace · saved in this browser only</p>}
          {user ? (
            <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-blue text-xs font-bold text-white">{(user.name || user.email)[0].toUpperCase()}</span><span className="min-w-0 flex-1 truncate text-xs">{user.name}<span className="block text-faint">{user.email}</span></span><button className="btn btn-ghost p-1.5" aria-label="Sign out" onClick={doSignOut}><LogOut className="size-4" /></button></div>
          ) : (
            <div className="grid gap-2"><Link to="/#contact" className="btn btn-primary text-xs">Request early access</Link><Link to="/" className="btn btn-ghost text-xs">Back to website</Link></div>
          )}
        </div>
      </aside>
      {side && <div className="fixed inset-0 z-[60] bg-black/50 lg:hidden" onClick={() => setSide(false)} />}

      <div className="min-w-0">
        <header className="no-print sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-xl sm:px-6">
          <button className="btn btn-line p-2 lg:hidden" aria-label="Open menu" onClick={() => setSide(true)}><Menu className="size-4" /></button>
          <form onSubmit={search} className="relative max-w-md flex-1" role="search">
            <label htmlFor="ws-search" className="sr-only">Search assets</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input id="ws-search" type="search" className="input pl-9" placeholder="Search assets by tag or name…" value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
          {ws.mode === "local" && <Chip tone="warning" className="hidden sm:inline-flex">Sample data</Chip>}
          <div className="relative ml-auto" ref={bellRef}>
            <button className="btn btn-line relative p-2" aria-label={`Notifications, ${openAlerts.length} open alerts`} aria-expanded={bell} onClick={() => setBell((b) => !b)}>
              <BellRing className="size-4" />{openAlerts.length > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-crit text-[0.6rem] font-bold text-white">{openAlerts.length}</span>}
            </button>
            {bell && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-line-2 bg-panel shadow-2xl">
                <p className="border-b border-line px-4 py-3 text-sm font-semibold">Open alerts</p>
                {openAlerts.length === 0 ? <p className="px-4 py-6 text-center text-sm text-muted">You're all caught up.</p> : openAlerts.slice(0, 5).map((a) => (
                  <button key={a.id} onClick={() => { setBell(false); go("alerts"); }} className="block w-full border-b border-line px-4 py-3 text-left text-sm hover:bg-panel-2"><span className="font-medium text-ink">{a.title}</span><span className="block text-xs text-muted">{a.assetId} · {a.severity}</span></button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{panel}</main>
      </div>
    </div>
  );
}
