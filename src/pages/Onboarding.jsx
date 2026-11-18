import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Logo } from "../components/ui/Logo.jsx";
import { Field, SubmitButton, Chip } from "../components/ui/primitives.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { createStore } from "../lib/store.js";
import { useToast } from "../hooks/useToast.jsx";

const INDUSTRIES = ["Manufacturing", "Industrial production", "Food processing", "Mining", "Oil & gas", "Industrial engineering", "Equipment operator", "Other"];
const SIZES = ["1–50 employees", "51–200 employees", "201–1,000 employees", "1,000+ employees"];
const USES = ["Predict equipment failures", "Monitor machine health", "Prioritise maintenance work", "Reduce downtime / analyse reliability"];
const EQUIPMENT = ["Motors", "Pumps", "Gearboxes", "Compressors", "Fans", "Conveyors", "Refrigeration", "Crushers"];
const ASSET_COUNT = ["Under 50", "50–200", "200–1,000", "Over 1,000"];
const APPROACH = ["Mostly reactive (run to failure)", "Calendar-based preventive", "Some condition monitoring", "Mixed"];
const PRIORITY = ["Fewer unplanned stops", "Lower parts & overtime cost", "Better maintenance planning", "Reliability reporting"];

export default function Onboarding() {
  const { user, ready, configured } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState({});
  const [saving, setSaving] = useState(false);
  const [v, setV] = useState({ workspace: "", organization: "", industry: "", size: "", useCase: "", equipment: [], assetCount: "", approach: "", priority: "" });

  if (configured && ready && !user) return <Navigate to="/login" state={{ from: "/onboarding" }} replace />;

  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErr({ ...err, [k]: undefined }); };
  const toggle = (x) => setV({ ...v, equipment: v.equipment.includes(x) ? v.equipment.filter((y) => y !== x) : [...v.equipment, x] });

  const next = (e) => {
    e.preventDefault();
    const x = {};
    if (step === 0) {
      if (v.workspace.trim().length < 2) x.workspace = "Name your workspace (e.g. Plant 2 Maintenance).";
      if (!v.organization.trim()) x.organization = "Enter your organisation.";
      ["industry", "size", "useCase"].forEach((k) => !v[k] && (x[k] = "Please choose one."));
    } else if (step === 1) {
      if (!v.equipment.length) x.equipment = "Pick at least one equipment type.";
      ["assetCount", "approach", "priority"].forEach((k) => !v[k] && (x[k] = "Please choose one."));
    }
    setErr(x);
    if (Object.keys(x).length) return;
    if (step === 1) return finish();
    setStep(step + 1);
  };

  const finish = async () => {
    setSaving(true);
    try {
      await createStore(user).saveProfile({ ...v, createdAt: new Date().toISOString() });
      setStep(2);
    } catch (e) { toast(`Couldn't save your workspace: ${e.message}`, "error"); }
    finally { setSaving(false); }
  };

  const sel = (k, label, opts, className) => (
    <Field label={label} error={err[k]} className={className}>{(a) => <select {...a} className="input" value={v[k]} onChange={set(k)}><option value="">Select</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>}</Field>
  );

  return (
    <div className="min-h-screen">
      <header className="wrap flex h-16 items-center justify-between"><Logo />{!configured && <Chip tone="warning">Sample workspace · saved in this browser</Chip>}</header>
      <div className="wrap max-w-2xl py-10">
        <ol className="mb-10 flex items-center gap-3" aria-label="Progress">
          {["Workspace", "Your equipment", "Ready"].map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-3">
              <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-blue text-white" : "bg-panel-2 text-faint"}`} aria-current={i === step ? "step" : undefined}>{i + 1}</span>
              <span className={`hidden text-sm sm:block ${i === step ? "text-ink" : "text-faint"}`}>{s}</span>
              {i < 2 && <span className="h-px flex-1 bg-line-2" />}
            </li>
          ))}
        </ol>

        {step < 2 ? (
          <form onSubmit={next} noValidate className="card p-6 sm:p-8">
            {step === 0 ? (
              <>
                <h1 className="text-2xl font-extrabold">Set up your workspace</h1>
                <p className="mt-1 text-muted">A workspace holds one site's assets, alerts and work orders.</p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Field label="Workspace name" error={err.workspace}>{(a) => <input {...a} className="input" placeholder="Plant 2 Maintenance" value={v.workspace} onChange={set("workspace")} />}</Field>
                  <Field label="Organisation" error={err.organization}>{(a) => <input {...a} className="input" autoComplete="organization" value={v.organization} onChange={set("organization")} />}</Field>
                  {sel("industry", "Industry", INDUSTRIES)}
                  {sel("size", "Company size", SIZES)}
                  {sel("useCase", "Primary use case", USES, "sm:col-span-2")}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold">Tell us about your equipment</h1>
                <p className="mt-1 text-muted">We use this to tailor alerts and recommendations.</p>
                <fieldset className="mt-7">
                  <legend className="label">Which equipment do you maintain?</legend>
                  <div className="flex flex-wrap gap-2">{EQUIPMENT.map((x) => <button type="button" key={x} onClick={() => toggle(x)} aria-pressed={v.equipment.includes(x)} className={`rounded-lg border px-3 py-2 text-sm ${v.equipment.includes(x) ? "border-blue bg-blue/15 text-ink" : "border-line-2 text-muted hover:border-faint"}`}>{x}</button>)}</div>
                  {err.equipment && <p className="mt-1.5 text-xs text-crit">{err.equipment}</p>}
                </fieldset>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {sel("assetCount", "Critical assets", ASSET_COUNT)}
                  {sel("approach", "Current maintenance approach", APPROACH)}
                  {sel("priority", "Top priority", PRIORITY, "sm:col-span-2")}
                </div>
              </>
            )}
            <div className="mt-8 flex justify-between gap-3">
              {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" />Back</button> : <span />}
              <SubmitButton loading={saving} className="btn btn-primary">{step === 1 ? "Create workspace" : "Continue"}<ArrowRight className="size-4" /></SubmitButton>
            </div>
          </form>
        ) : (
          <div className="card p-8 text-center sm:p-12">
            <CheckCircle2 className="mx-auto size-12 text-ok" />
            <h1 className="mt-5 text-3xl font-extrabold">{v.workspace} is ready</h1>
            <p className="mx-auto mt-3 max-w-md text-muted">
              {configured ? "Your workspace is set up. Next, add your critical assets." : "Your sample workspace is set up in this browser with fictional Ridgeway Packaging data, so you can try every screen before connecting real equipment."}
            </p>
            <button className="btn btn-primary btn-lg mt-8" onClick={() => nav("/dashboard", { replace: true })}>Open Workspace <ArrowRight className="size-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
