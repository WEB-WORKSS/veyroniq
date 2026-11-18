import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Boxes, ClipboardList, ClipboardCheck, X, Wrench, CheckCircle2 } from "lucide-react";
import { Modal, ConfirmModal, Field, Chip, Empty } from "../ui/primitives.jsx";
import { useTable, SortTh, Toolbar, PageHead, assetName } from "./common.jsx";
import { LINES, ASSET_TYPES, CRITICALITY, WO_STATUS, PRIORITY, TECHS, FORECASTS, statusOf, trend } from "../../data/product-data.js";
import { Sparkline } from "../sections/Showcase.jsx";
import { useToast } from "../../hooks/useToast.jsx";
import { fmtDate, today } from "../../lib/utils.js";

const SLABEL = { healthy: "Healthy", watch: "Watch", act: "Act now", offline: "Offline" };

function FormModal({ open, onClose, title, fields, initial, onSave }) {
  const [v, setV] = useState(initial);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const save = async (e) => {
    e.preventDefault();
    const x = {};
    fields.forEach((f) => { if (f.required && !String(v[f.k] ?? "").trim()) x[f.k] = `${f.label} is required.`; if (f.validate) { const m = f.validate(v[f.k], v); if (m) x[f.k] = m; } });
    setErr(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    try { await onSave(v); onClose(); } catch (ex) { toast(ex.message, "error"); } finally { setBusy(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.k} label={f.label} error={err[f.k]} className={f.wide ? "sm:col-span-2" : ""}>{(a) =>
            f.options ? <select {...a} className="input" value={v[f.k] ?? ""} onChange={(e) => setV({ ...v, [f.k]: e.target.value })}><option value="">Select</option>{f.options.map((o) => typeof o === "string" ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}</select>
            : f.type === "textarea" ? <textarea {...a} rows={3} className="input" value={v[f.k] ?? ""} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />
            : <input {...a} type={f.type || "text"} className="input" value={v[f.k] ?? ""} onChange={(e) => setV({ ...v, [f.k]: f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value })} {...(f.attrs || {})} />
          }</Field>
        ))}
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save"}</button></div>
      </form>
    </Modal>
  );
}

/* ---------------- Assets ---------------- */
export function Assets({ ws, initialQuery = "" }) {
  const toast = useToast();
  const t = useTable(ws.data.assets, { search: ["id", "name", "type", "line"], initialSort: ["health", "asc"] });
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [open, setOpen] = useState(null);
  useEffect(() => { if (initialQuery) t.setQ(initialQuery); }, [initialQuery]);
  const fields = [
    { k: "id", label: "Asset tag", required: true, validate: (val) => (!edit?.id && ws.data.assets.some((a) => a.id === val?.trim()) ? "That tag is already in use." : null), attrs: { disabled: !!edit?.id } },
    { k: "name", label: "Name", required: true }, { k: "type", label: "Type", required: true, options: ASSET_TYPES },
    { k: "line", label: "Line / area", required: true, options: LINES }, { k: "criticality", label: "Criticality", required: true, options: CRITICALITY },
    { k: "health", label: "Health score (0–100)", type: "number", required: true, validate: (x) => (x === "" || x < 0 || x > 100 ? "Enter 0–100." : null) },
    { k: "lastService", label: "Last service", type: "date" }, { k: "runtimeHours", label: "Runtime since service (h)", type: "number" },
    { k: "notes", label: "Notes", type: "textarea", wide: true },
  ];
  const sel = ws.data.assets.find((a) => a.id === open);
  return (
    <>
      <PageHead title="Assets" sub={`${ws.data.assets.length} monitored assets`}>
        <button className="btn btn-primary" onClick={() => setEdit({ health: 100, criticality: "Medium", vibration: 2, temperature: 50, runtimeHours: 0, lastService: today() })}><Plus className="size-4" />Add asset</button>
      </PageHead>
      <Toolbar t={t} placeholder="Search tag, name, type" filters={[["line", "Line", LINES], ["type", "Type", ASSET_TYPES], ["criticality", "Criticality", CRITICALITY]]} />
      {t.view.length === 0 ? <Empty icon={Boxes} title="No assets found" text={ws.data.assets.length ? "Try a different search or filter." : "Add your first critical asset to start monitoring."} /> : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[760px]">
            <thead className="bg-panel"><tr><SortTh k="id" label="Tag" t={t} /><SortTh k="name" label="Asset" t={t} /><SortTh k="line" label="Line" t={t} /><SortTh k="criticality" label="Criticality" t={t} /><SortTh k="health" label="Health" t={t} /><SortTh k="lastService" label="Last service" t={t} /><th className="th"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {t.view.map((a) => { const s = statusOf(a.health); return (
                <tr key={a.id} className="cursor-pointer hover:bg-panel/60" onClick={() => setOpen(a.id)}>
                  <td className="td font-mono text-xs text-muted">{a.id}</td>
                  <td className="td"><span className="font-medium text-ink">{a.name}</span><span className="block text-xs text-faint">{a.type}</span></td>
                  <td className="td text-muted">{a.line}</td><td className="td text-muted">{a.criticality}</td>
                  <td className="td"><Chip tone={s}>{a.health} · {SLABEL[s]}</Chip></td>
                  <td className="td text-muted">{fmtDate(a.lastService)}</td>
                  <td className="td text-right" onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-ghost p-1.5" aria-label={`Edit ${a.id}`} onClick={() => setEdit(a)}><Pencil className="size-4" /></button>
                    <button className="btn btn-ghost p-1.5 hover:text-crit" aria-label={`Delete ${a.id}`} onClick={() => setDel(a)}><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      )}
      {edit && <FormModal open onClose={() => setEdit(null)} title={edit.id ? `Edit ${edit.id}` : "Add asset"} fields={fields} initial={edit}
        onSave={async (v) => { const rec = { ...v, id: v.id.trim(), health: Number(v.health) }; edit.id ? await ws.assets.update(edit.id, rec) : await ws.assets.create(rec, `Asset added: ${rec.id} ${rec.name}`); toast(edit.id ? "Asset updated." : "Asset added."); }} />}
      <ConfirmModal open={!!del} onClose={() => setDel(null)} title={`Delete ${del?.id}?`} body={`${del?.name} and its readings will be removed from this workspace. Work orders that reference it are kept.`}
        onConfirm={async () => { await ws.assets.remove(del.id, `Asset deleted: ${del.id} ${del.name}`); toast("Asset deleted."); if (open === del.id) setOpen(null); }} />
      {sel && <AssetDrawer a={sel} ws={ws} onClose={() => setOpen(null)} />}
    </>
  );
}

function AssetDrawer({ a, ws, onClose }) {
  const toast = useToast();
  const fc = FORECASTS[a.id];
  const wos = ws.data.workOrders.filter((w) => w.assetId === a.id);
  const s = statusOf(a.health);
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-black/50" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="toast-in h-full w-full max-w-md overflow-auto border-l border-line-2 bg-panel p-6" role="dialog" aria-label={`${a.name} details`}>
        <div className="flex items-start justify-between"><div><p className="font-mono text-xs text-muted">{a.id} · {a.type} · {a.line}</p><h2 className="mt-1 text-xl font-bold">{a.name}</h2></div><button className="btn btn-ghost p-1.5" onClick={onClose} aria-label="Close"><X className="size-4" /></button></div>
        <div className="mt-4 flex items-center gap-3"><span className="font-display text-4xl font-extrabold">{a.health}</span><Chip tone={s}>{SLABEL[s]}</Chip><span className="text-xs text-faint">Criticality {a.criticality}</span></div>
        <div className="mt-5 rounded-xl border border-line bg-bg-2 p-3"><p className="text-xs text-muted">Vibration · last 48 h (sample)</p><Sparkline data={trend(a)} threshold={7.1} /></div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">{[["Vibration", `${a.vibration ?? "—"} mm/s`], ["Temp", `${a.temperature ?? "—"} °C`], ["Runtime", `${a.runtimeHours ?? 0} h`]].map(([k, v]) => <div key={k} className="rounded-lg border border-line px-3 py-2"><p className="text-[0.7rem] text-faint">{k}</p><p className="font-mono text-xs">{v}</p></div>)}</div>
        {fc && (
          <div className="mt-4 rounded-xl border border-warn/30 bg-warn/[0.06] p-4 text-sm">
            <p className="font-semibold text-warn">Forecast · {fc.component}</p>
            <p className="mt-1 text-muted">Likely in <b className="text-ink">{fc.window[0]}–{fc.window[1]} days</b> · {fc.confidence.toLowerCase()} confidence</p>
            <p className="mt-2 text-muted">{fc.action}</p>
            <p className="mt-2 text-xs text-faint">Parts: {fc.parts} · est. {fc.hours} h</p>
            <button className="btn btn-primary mt-3" onClick={async () => { await ws.workOrders.create({ assetId: a.id, title: fc.action.split(".")[0], priority: fc.window[0] < 10 ? "P1" : "P2", status: "Open", assignee: "Unassigned", due: today(), hours: fc.hours }, `Work order created from forecast for ${a.id}`); toast("Work order created."); }}><Wrench className="size-4" />Create work order</button>
          </div>
        )}
        <h3 className="mt-6 text-sm font-bold">Work orders</h3>
        {wos.length ? <ul className="mt-2 space-y-2">{wos.map((w) => <li key={w.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"><span><span className="font-mono text-xs text-muted">{w.id}</span> {w.title}</span><Chip tone={w.status === "Done" ? "healthy" : "blue"}>{w.status}</Chip></li>)}</ul> : <p className="mt-2 text-sm text-muted">No work orders for this asset.</p>}
        {a.notes && <><h3 className="mt-6 text-sm font-bold">Notes</h3><p className="mt-1 text-sm text-muted">{a.notes}</p></>}
      </aside>
    </div>
  );
}

/* ---------------- Work orders ---------------- */
export function WorkOrders({ ws, preset }) {
  const toast = useToast();
  const t = useTable(ws.data.workOrders, { search: ["id", "title", "assetId", "assignee"], initialSort: ["due", "asc"] });
  const [edit, setEdit] = useState(preset || null);
  const [del, setDel] = useState(null);
  const assetOpts = ws.data.assets.map((a) => ({ value: a.id, label: `${a.id} · ${a.name}` }));
  const fields = [
    { k: "title", label: "Task", required: true, wide: true }, { k: "assetId", label: "Asset", required: true, options: assetOpts },
    { k: "priority", label: "Priority", required: true, options: PRIORITY }, { k: "status", label: "Status", required: true, options: WO_STATUS },
    { k: "assignee", label: "Assignee", required: true, options: TECHS }, { k: "due", label: "Due date", type: "date", required: true },
    { k: "hours", label: "Estimated hours", type: "number" }, { k: "notes", label: "Notes", type: "textarea", wide: true },
  ];
  const overdue = (w) => w.status !== "Done" && w.due < today();
  return (
    <>
      <PageHead title="Work orders" sub={`${ws.data.workOrders.filter((w) => w.status !== "Done").length} open · ${ws.data.workOrders.filter(overdue).length} overdue`}>
        <button className="btn btn-primary" onClick={() => setEdit({ status: "Open", priority: "P2", assignee: "Unassigned", due: today() })}><Plus className="size-4" />New work order</button>
      </PageHead>
      <Toolbar t={t} placeholder="Search work orders" filters={[["status", "Status", WO_STATUS], ["priority", "Priority", PRIORITY], ["assignee", "Assignee", TECHS]]} />
      {t.view.length === 0 ? <Empty icon={ClipboardList} title="No work orders" text="Create one, or raise one from an alert or forecast." /> : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[820px]">
            <thead className="bg-panel"><tr><SortTh k="id" label="ID" t={t} /><SortTh k="title" label="Task" t={t} /><SortTh k="priority" label="Priority" t={t} /><SortTh k="status" label="Status" t={t} /><SortTh k="assignee" label="Assignee" t={t} /><SortTh k="due" label="Due" t={t} /><th className="th"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {t.view.map((w) => (
                <tr key={w.id} className="hover:bg-panel/60">
                  <td className="td font-mono text-xs text-muted">{w.id}</td>
                  <td className="td"><span className="text-ink">{w.title}</span><span className="block text-xs text-faint">{assetName(ws.data, w.assetId)}</span></td>
                  <td className="td"><Chip tone={w.priority === "P1" ? "critical" : w.priority === "P2" ? "warning" : "neutral"}>{w.priority}</Chip></td>
                  <td className="td">
                    <select aria-label={`Status of ${w.id}`} className="input w-auto py-1.5 text-xs" value={w.status} onChange={async (e) => { await ws.workOrders.update(w.id, { status: e.target.value }, `${w.id} moved to ${e.target.value}`); toast(`${w.id} → ${e.target.value}`); }}>
                      {WO_STATUS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="td text-muted">{w.assignee}</td>
                  <td className={`td ${overdue(w) ? "text-crit" : "text-muted"}`}>{fmtDate(w.due)}{overdue(w) && <span className="block text-xs">Overdue</span>}</td>
                  <td className="td whitespace-nowrap text-right">
                    <button className="btn btn-ghost p-1.5" aria-label={`Edit ${w.id}`} onClick={() => setEdit(w)}><Pencil className="size-4" /></button>
                    <button className="btn btn-ghost p-1.5 hover:text-crit" aria-label={`Delete ${w.id}`} onClick={() => setDel(w)}><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {edit && <FormModal open onClose={() => setEdit(null)} title={edit.id ? `Edit ${edit.id}` : "New work order"} fields={fields} initial={edit}
        onSave={async (v) => { edit.id ? await ws.workOrders.update(edit.id, v) : await ws.workOrders.create(v, `Work order created: ${v.title}`); toast(edit.id ? "Work order updated." : "Work order created."); }} />}
      <ConfirmModal open={!!del} onClose={() => setDel(null)} title={`Delete ${del?.id}?`} body={`“${del?.title}” will be permanently removed from this workspace.`}
        onConfirm={async () => { await ws.workOrders.remove(del.id, `Work order deleted: ${del.id}`); toast("Work order deleted."); }} />
    </>
  );
}

/* ---------------- Inspections ---------------- */
export function Inspections({ ws }) {
  const toast = useToast();
  const t = useTable(ws.data.inspections, { search: ["id", "title", "assetId"], initialSort: ["due", "asc"] });
  const [edit, setEdit] = useState(null);
  const [record, setRecord] = useState(null);
  const [del, setDel] = useState(null);
  const assetOpts = ws.data.assets.map((a) => ({ value: a.id, label: `${a.id} · ${a.name}` }));
  const fields = [
    { k: "title", label: "Inspection", required: true, wide: true }, { k: "assetId", label: "Asset", required: true, options: assetOpts },
    { k: "frequency", label: "Frequency", required: true, options: ["Daily", "Weekly", "Monthly", "Quarterly"] }, { k: "due", label: "Next due", type: "date", required: true },
  ];
  const next = (d, f) => { const x = new Date(d + "T00:00:00"); ({ Daily: () => x.setDate(x.getDate() + 1), Weekly: () => x.setDate(x.getDate() + 7), Monthly: () => x.setMonth(x.getMonth() + 1), Quarterly: () => x.setMonth(x.getMonth() + 3) })[f](); return x.toISOString().slice(0, 10); };
  return (
    <>
      <PageHead title="Inspections" sub="Routine checks and their results"><button className="btn btn-primary" onClick={() => setEdit({ frequency: "Weekly", due: today() })}><Plus className="size-4" />Schedule inspection</button></PageHead>
      <Toolbar t={t} placeholder="Search inspections" filters={[["status", "Status", ["Due", "Passed", "Failed"]], ["frequency", "Frequency", ["Daily", "Weekly", "Monthly", "Quarterly"]]]} />
      {t.view.length === 0 ? <Empty icon={ClipboardCheck} title="No inspections" text="Schedule routine checks for critical assets." /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {t.view.map((i) => {
            const late = i.status === "Due" && i.due < today();
            return (
              <article key={i.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-mono text-xs text-muted">{i.id} · {i.frequency}</p><h3 className="mt-1 font-semibold">{i.title}</h3><p className="text-xs text-faint">{assetName(ws.data, i.assetId)}</p></div>
                  <Chip tone={i.status === "Passed" ? "healthy" : i.status === "Failed" ? "critical" : late ? "warning" : "blue"}>{late ? "Overdue" : i.status}</Chip>
                </div>
                <p className="mt-3 text-sm text-muted">Due {fmtDate(i.due)}{i.result && <> · <span className="text-ink">{i.result}</span></>}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {i.status === "Due" && <button className="btn btn-line py-1.5 text-xs" onClick={() => setRecord(i)}><CheckCircle2 className="size-3.5" />Record result</button>}
                  <button className="btn btn-ghost py-1.5 text-xs" onClick={() => setEdit(i)}><Pencil className="size-3.5" />Edit</button>
                  <button className="btn btn-ghost py-1.5 text-xs hover:text-crit" onClick={() => setDel(i)}><Trash2 className="size-3.5" />Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {edit && <FormModal open onClose={() => setEdit(null)} title={edit.id ? `Edit ${edit.id}` : "Schedule inspection"} fields={fields} initial={edit}
        onSave={async (v) => { edit.id ? await ws.inspections.update(edit.id, v) : await ws.inspections.create({ ...v, status: "Due", result: "" }, `Inspection scheduled: ${v.title}`); toast("Inspection saved."); }} />}
      {record && <FormModal open onClose={() => setRecord(null)} title={`Record result · ${record.id}`} initial={{ outcome: "", result: "" }}
        fields={[{ k: "outcome", label: "Outcome", required: true, options: ["Passed", "Failed"] }, { k: "result", label: "Findings", type: "textarea", wide: true, required: true }]}
        onSave={async (v) => {
          await ws.commit((d) => {
            d.inspections = d.inspections.map((x) => (x.id === record.id ? { ...x, status: v.outcome, result: v.result } : x));
            d.inspections.unshift({ ...record, id: `IN-${Math.floor(Math.random() * 9000 + 1000)}`, due: next(record.due, record.frequency), status: "Due", result: "" });
            if (v.outcome === "Failed") d.workOrders.unshift({ id: `WO-${Math.floor(Math.random() * 9000 + 1000)}`, assetId: record.assetId, title: `Follow up failed inspection: ${record.title}`, priority: "P2", status: "Open", assignee: "Unassigned", due: today(), hours: 1 });
            return d;
          }, `Inspection ${record.id} ${v.outcome.toLowerCase()}${v.outcome === "Failed" ? " — follow-up work order created" : ""}`);
          toast(v.outcome === "Failed" ? "Recorded. A follow-up work order was created." : "Recorded. Next inspection scheduled.");
        }} />}
      <ConfirmModal open={!!del} onClose={() => setDel(null)} title={`Delete ${del?.id}?`} body="This inspection will be permanently removed."
        onConfirm={async () => { await ws.inspections.remove(del.id, `Inspection deleted: ${del.id}`); toast("Inspection deleted."); }} />
    </>
  );
}
