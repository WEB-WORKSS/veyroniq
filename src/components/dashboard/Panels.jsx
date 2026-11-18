import { useState } from "react";
import { BellRing, CheckCheck, Wrench, XCircle, FileDown, Printer, RotateCcw, Trash2, History, AlertTriangle, Gauge, ClipboardList, CalendarClock } from "lucide-react";
import { Chip, Empty, ConfirmModal } from "../ui/primitives.jsx";
import { PageHead, assetName, useTable, Toolbar } from "./common.jsx";
import { LINES, FORECASTS, DOWNTIME, statusOf } from "../../data/product-data.js";
import { useToast } from "../../hooks/useToast.jsx";
import { download, toCSV, fmtDate, today } from "../../lib/utils.js";

export function Overview({ ws, go }) {
  const d = ws.data;
  const atRisk = d.assets.filter((a) => a.health < 75);
  const openWO = d.workOrders.filter((w) => w.status !== "Done");
  const overdueIns = d.inspections.filter((i) => i.status === "Due" && i.due < today());
  const openAlerts = d.alerts.filter((a) => a.status === "open");
  const KPI = [[Gauge, "Assets monitored", d.assets.length, "assets"], [AlertTriangle, "Assets at risk", atRisk.length, "assets"], [ClipboardList, "Open work orders", openWO.length, "work-orders"], [CalendarClock, "Overdue inspections", overdueIns.length, "inspections"]];
  const risks = Object.entries(FORECASTS).map(([id, f]) => ({ a: d.assets.find((x) => x.id === id), f })).filter((x) => x.a).sort((x, y) => x.f.window[0] - y.f.window[0]);
  return (
    <>
      <PageHead title={`Good to see you${ws.profile?.workspace ? ` · ${ws.profile.workspace}` : ""}`} sub="What needs attention across the plant today." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPI.map(([I, k, v, view]) => (
          <button key={k} onClick={() => go(view)} className="card p-5 text-left transition hover:border-line-2">
            <I className="size-5 text-cyan" /><p className="mt-4 font-display text-3xl font-extrabold">{v}</p><p className="text-sm text-muted">{k}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="card p-5">
          <h2 className="text-base font-bold">Failure forecasts</h2>
          <p className="text-xs text-faint">Sorted by soonest likely failure</p>
          <ul className="mt-4 space-y-2">
            {risks.length === 0 && <li className="text-sm text-muted">No active forecasts.</li>}
            {risks.map(({ a, f }) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line px-3 py-2.5">
                <span className="w-14 font-mono text-xs text-muted">{a.id}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm text-ink">{a.name}</span><span className="text-xs text-faint">{f.component}</span></span>
                <Chip tone={f.window[0] < 10 ? "critical" : f.window[0] < 30 ? "warning" : "info"}>{f.window[0]}–{f.window[1]} days</Chip>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="text-base font-bold">Health by line</h2>
          <div className="mt-4 space-y-3">
            {LINES.map((l) => {
              const as = d.assets.filter((a) => a.line === l);
              return (
                <div key={l}>
                  <div className="mb-1.5 flex justify-between text-xs"><span className="text-muted">{l}</span><span className="font-mono text-faint">{as.length ? Math.round(as.reduce((s, a) => s + a.health, 0) / as.length) : "—"}</span></div>
                  <div className="flex gap-1">{as.map((a) => <button key={a.id} title={`${a.id} ${a.name}: ${a.health}`} aria-label={`${a.id} ${a.name} health ${a.health}`} onClick={() => go("assets", a.id)} className={`h-6 flex-1 rounded ${{ healthy: "bg-ok/70", watch: "bg-warn", act: "bg-crit", offline: "bg-off" }[statusOf(a.health)]} hover:opacity-80`} />)}{!as.length && <span className="text-xs text-faint">No assets</span>}</div>
                </div>
              );
            })}
          </div>
          <h2 className="mt-6 text-base font-bold">Recent activity</h2>
          <ul className="mt-3 space-y-2 text-sm">{d.activity.slice(0, 5).map((e) => <li key={e.id} className="flex justify-between gap-3"><span className="text-muted">{e.text}</span><span className="shrink-0 text-xs text-faint">{new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></li>)}</ul>
          {openAlerts.length > 0 && <button className="btn btn-line mt-5 w-full" onClick={() => go("alerts")}><BellRing className="size-4" />{openAlerts.length} open alerts</button>}
        </section>
      </div>
    </>
  );
}

export function Alerts({ ws, go }) {
  const toast = useToast();
  const t = useTable(ws.data.alerts, { search: ["title", "detail", "assetId"], initialSort: ["createdAt", "desc"] });
  const act = async (a, status, msg) => { await ws.alerts.update(a.id, { status }, `Alert ${a.id} ${msg}`); toast(`Alert ${msg}.`); };
  return (
    <>
      <PageHead title="Alerts" sub={`${ws.data.alerts.filter((a) => a.status === "open").length} open`} />
      <Toolbar t={t} placeholder="Search alerts" filters={[["status", "Status", ["open", "acknowledged", "resolved", "dismissed"]], ["severity", "Severity", ["critical", "warning", "info"]]]} />
      {t.view.length === 0 ? <Empty icon={CheckCheck} title="No alerts here" text="Nothing matches this filter." /> : (
        <ul className="space-y-3">
          {t.view.map((a) => (
            <li key={a.id} className="card flex flex-wrap items-start gap-4 p-5">
              <Chip tone={a.severity}>{a.severity}</Chip>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="text-sm text-muted">{assetName(ws.data, a.assetId)} · {a.detail}</p>
                <p className="mt-1 text-xs text-faint">{a.id} · raised {fmtDate(a.createdAt)} · <span className="capitalize">{a.status}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {a.status === "open" && <button className="btn btn-line py-1.5 text-xs" onClick={() => act(a, "acknowledged", "acknowledged")}><CheckCheck className="size-3.5" />Acknowledge</button>}
                {a.status !== "resolved" && a.status !== "dismissed" && <button className="btn btn-primary py-1.5 text-xs" onClick={async () => {
                  const fc = FORECASTS[a.assetId];
                  await ws.commit((d) => { d.workOrders.unshift({ id: `WO-${Math.floor(Math.random() * 9000 + 1000)}`, assetId: a.assetId, title: fc ? fc.action.split(".")[0] : `Investigate: ${a.title}`, priority: a.severity === "critical" ? "P1" : "P2", status: "Open", assignee: "Unassigned", due: today(), hours: fc?.hours || 1 }); d.alerts = d.alerts.map((x) => (x.id === a.id ? { ...x, status: "resolved" } : x)); return d; }, `Work order raised from alert ${a.id}`);
                  toast("Work order created and alert resolved."); go("work-orders");
                }}><Wrench className="size-3.5" />Create work order</button>}
                {a.status === "open" && <button className="btn btn-ghost py-1.5 text-xs" onClick={() => act(a, "dismissed", "dismissed")}><XCircle className="size-3.5" />Dismiss</button>}
                {(a.status === "dismissed" || a.status === "acknowledged") && <button className="btn btn-ghost py-1.5 text-xs" onClick={() => act(a, "open", "reopened")}>Reopen</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function Reports({ ws }) {
  const d = ws.data;
  const toast = useToast();
  const total = DOWNTIME.reduce((s, x) => s + x.hours, 0);
  const csv = (name, rows, cols) => { download(`veyroniq-${name}-${today()}.csv`, toCSV(rows, cols), "text/csv"); toast(`${name} exported.`); };
  return (
    <div className="print-area">
      <PageHead title="Reports" sub="Export records or print a maintenance summary (choose “Save as PDF” in the print dialog).">
        <div className="no-print flex flex-wrap gap-2">
          <button className="btn btn-line" onClick={() => csv("assets", d.assets, [{ key: "id", label: "Tag" }, { key: "name", label: "Name" }, { key: "type", label: "Type" }, { key: "line", label: "Line" }, { key: "criticality", label: "Criticality" }, { key: "health", label: "Health" }, { key: "lastService", label: "Last service" }])}><FileDown className="size-4" />Assets CSV</button>
          <button className="btn btn-line" onClick={() => csv("work-orders", d.workOrders, [{ key: "id", label: "ID" }, { key: "title", label: "Task" }, { key: "assetId", label: "Asset" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status" }, { key: "assignee", label: "Assignee" }, { key: "due", label: "Due" }, { key: "hours", label: "Est. hours" }])}><FileDown className="size-4" />Work orders CSV</button>
          <button className="btn btn-line" onClick={() => csv("inspections", d.inspections, [{ key: "id", label: "ID" }, { key: "title", label: "Inspection" }, { key: "assetId", label: "Asset" }, { key: "frequency", label: "Frequency" }, { key: "due", label: "Due" }, { key: "status", label: "Status" }, { key: "result", label: "Result" }])}><FileDown className="size-4" />Inspections CSV</button>
          <button className="btn btn-primary" onClick={() => window.print()}><Printer className="size-4" />Print / PDF summary</button>
        </div>
      </PageHead>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-base font-bold">Downtime by cause · last 90 days</h2><p className="text-xs text-faint">Sample data · {total} h total</p>
          <div className="mt-4 space-y-2.5">{DOWNTIME.map((x) => <div key={x.cause} className="grid grid-cols-[130px_1fr_44px] items-center gap-2 text-sm"><span className="text-muted">{x.cause}</span><div className="h-2.5 rounded bg-line"><div className="h-2.5 rounded bg-blue" style={{ width: `${(x.hours / DOWNTIME[0].hours) * 100}%` }} /></div><span className="text-right font-mono text-xs">{x.hours} h</span></div>)}</div>
        </section>
        <section className="card p-5">
          <h2 className="text-base font-bold">Work order summary</h2>
          <table className="mt-3 w-full text-sm"><tbody>
            {["Open", "Scheduled", "In progress", "Done"].map((s) => <tr key={s}><td className="td text-muted">{s}</td><td className="td text-right font-mono">{d.workOrders.filter((w) => w.status === s).length}</td></tr>)}
            <tr><td className="td text-muted">Estimated open hours</td><td className="td text-right font-mono">{d.workOrders.filter((w) => w.status !== "Done").reduce((s, w) => s + (Number(w.hours) || 0), 0)} h</td></tr>
          </tbody></table>
        </section>
        <section className="card p-5 lg:col-span-2">
          <h2 className="text-base font-bold">Assets needing attention</h2>
          <table className="mt-3 w-full text-sm"><thead><tr><th className="th">Asset</th><th className="th">Line</th><th className="th">Health</th><th className="th">Forecast</th></tr></thead><tbody>
            {d.assets.filter((a) => a.health < 75).sort((a, b) => a.health - b.health).map((a) => <tr key={a.id}><td className="td">{a.id} · {a.name}</td><td className="td text-muted">{a.line}</td><td className="td font-mono">{a.health}</td><td className="td text-muted">{FORECASTS[a.id] ? `${FORECASTS[a.id].component} (${FORECASTS[a.id].window.join("–")} d)` : "—"}</td></tr>)}
          </tbody></table>
        </section>
      </div>
    </div>
  );
}

export function Activity({ ws }) {
  const t = useTable(ws.data.activity, { search: ["text"] });
  return (
    <>
      <PageHead title="Activity" sub="Everything changed in this workspace" />
      <Toolbar t={t} placeholder="Search activity" />
      {t.view.length === 0 ? <Empty icon={History} title="No activity" /> : (
        <ol className="relative space-y-1 border-l border-line-2 pl-6">
          {t.view.map((e) => <li key={e.id} className="relative py-2"><span className="absolute -left-[29px] top-3.5 size-2 rounded-full bg-cyan" /><p className="text-sm text-ink">{e.text}</p><p className="text-xs text-faint">{new Date(e.at).toLocaleString()}{e.by ? ` · ${e.by}` : ""}</p></li>)}
        </ol>
      )}
    </>
  );
}

export function Settings({ ws, user, configured, onSignOut }) {
  const toast = useToast();
  const [confirm, setConfirm] = useState(null);
  const p = ws.profile || {};
  return (
    <>
      <PageHead title="Settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-base font-bold">Account</h2>
          {user ? (
            <dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted">Name</dt><dd>{user.name}</dd></div><div className="flex justify-between"><dt className="text-muted">Email</dt><dd>{user.email}</dd></div><div className="flex justify-between"><dt className="text-muted">Role</dt><dd>{user.isAdmin ? "Administrator" : "Member"}</dd></div></dl>
          ) : <p className="mt-3 text-sm text-muted">You're using the sample workspace without an account. {configured ? "" : "Accounts open with early access."}</p>}
          {user && <button className="btn btn-line mt-5" onClick={onSignOut}>Sign out of all devices</button>}
        </section>
        <section id="workspace" className="card p-6">
          <h2 className="text-base font-bold">Workspace</h2>
          {ws.profile ? (
            <dl className="mt-4 space-y-2 text-sm">{[["Workspace", p.workspace], ["Organisation", p.organization], ["Industry", p.industry], ["Company size", p.size], ["Primary use", p.useCase], ["Equipment", (p.equipment || []).join(", ")], ["Critical assets", p.assetCount], ["Top priority", p.priority]].map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-right">{v || "—"}</dd></div>)}</dl>
          ) : <p className="mt-3 text-sm text-muted">No workspace profile yet. <a href="/onboarding" className="text-cyan underline">Run setup</a>.</p>}
          {ws.profile && <a href="/onboarding" className="btn btn-line mt-5">Edit workspace setup</a>}
        </section>
        {ws.mode === "local" && (
          <section className="card p-6 lg:col-span-2">
            <h2 className="text-base font-bold">Sample data</h2>
            <p className="mt-2 text-sm text-muted">This workspace is stored only in this browser. It isn't backed up or shared.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn btn-line" onClick={() => setConfirm("reset")}><RotateCcw className="size-4" />Reset sample data</button>
              <button className="btn btn-line hover:border-crit hover:text-crit" onClick={() => setConfirm("clear")}><Trash2 className="size-4" />Clear workspace from this browser</button>
            </div>
          </section>
        )}
      </div>
      <ConfirmModal open={confirm === "reset"} onClose={() => setConfirm(null)} title="Reset sample data?" confirmLabel="Reset" body="All assets, alerts, work orders and inspections go back to the original sample. Your changes will be lost." onConfirm={async () => { await ws.resetSample(); toast("Sample data reset."); }} />
      <ConfirmModal open={confirm === "clear"} onClose={() => setConfirm(null)} title="Clear this workspace?" confirmLabel="Clear" body="Removes the workspace and setup answers from this browser. You'll start fresh next time." onConfirm={() => { ws.clearAll(); location.href = "/"; }} />
    </>
  );
}
