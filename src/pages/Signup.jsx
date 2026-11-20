import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Check, Eye, EyeOff, MailCheck } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell.jsx";
import { Field, SubmitButton } from "../components/ui/primitives.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { signUp, confirmSignUp, resendCode, friendlyError, passwordStrength } from "../lib/auth.js";
import { isEmail } from "../lib/utils.js";
import { useToast } from "../hooks/useToast.jsx";

export default function Signup() {
  const { signIn, user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [step, setStep] = useState("form");
  const [v, setV] = useState({ name: "", email: "", password: "", confirm: "", terms: false, code: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const pw = passwordStrength(v.password);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  if (user && step === "form") return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (v.name.trim().length < 2) x.name = "Enter your full name.";
    if (!isEmail(v.email)) x.email = "Enter a valid work email.";
    if (!pw.valid) x.password = "Use at least 10 characters with a mix of letters, numbers or symbols.";
    if (v.confirm !== v.password) x.confirm = "Passwords don't match.";
    if (!v.terms) x.terms = "Please accept the Terms and Privacy Policy.";
    setErr(x);
    if (Object.keys(x).length) return;
    setLoading(true);
    try { await signUp(v); setStep("confirm"); }
    catch (ex) { setErr({ form: friendlyError(ex), notConfigured: ex.code === "NotConfigured" }); }
    finally { setLoading(false); }
  };

  const confirm = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(v.code.trim())) return setErr({ code: "Enter the 6-digit code from your email." });
    setLoading(true);
    try {
      await confirmSignUp(v.email, v.code);
      await signIn(v.email, v.password, true);
      nav("/onboarding", { replace: true });
    } catch (ex) { setErr({ code: friendlyError(ex) }); }
    finally { setLoading(false); }
  };

  if (step === "confirm") {
    return (
      <AuthShell title="Check your email" subtitle={`We sent a 6-digit code to ${v.email}.`}>
        <MailCheck className="mb-6 size-8 text-cyan" />
        <form onSubmit={confirm} noValidate className="space-y-4">
          <Field label="Verification code" error={err.code}>{(a) => <input {...a} inputMode="numeric" autoComplete="one-time-code" className="input font-mono tracking-[0.4em]" maxLength={6} value={v.code} onChange={set("code")} />}</Field>
          <SubmitButton loading={loading}>Verify and continue</SubmitButton>
          <button type="button" className="btn btn-ghost w-full" onClick={async () => { try { await resendCode(v.email); toast("A new code is on its way."); } catch (ex) { toast(friendlyError(ex), "error"); } }}>Resend code</button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="Set up a Veyroniq workspace for your maintenance team." demoCta={{ to: "/onboarding", label: "Set up a sample workspace" }}
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-cyan hover:underline">Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Full name" error={err.name}>{(a) => <input {...a} autoComplete="name" className="input" value={v.name} onChange={set("name")} />}</Field>
        <Field label="Work email" error={err.email}>{(a) => <input {...a} type="email" autoComplete="email" className="input" value={v.email} onChange={set("email")} />}</Field>
        <Field label="Password" error={err.password}>{(a) => (
          <div className="relative">
            <input {...a} type={show ? "text" : "password"} autoComplete="new-password" className="input pr-10" value={v.password} onChange={set("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-faint hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          </div>
        )}</Field>
        {v.password && (
          <div aria-live="polite">
            <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <i key={i} className={`h-1 flex-1 rounded ${i < pw.score ? (pw.score >= 3 ? "bg-ok" : "bg-warn") : "bg-line"}`} />)}</div>
            <p className="mt-1.5 text-xs text-muted">Strength: {pw.label}</p>
            <ul className="mt-1 grid grid-cols-2 gap-1 text-xs">{pw.checks.map((c) => <li key={c.label} className={c.ok ? "text-ok" : "text-faint"}><Check className="mr-1 inline size-3" />{c.label}</li>)}</ul>
          </div>
        )}
        <Field label="Confirm password" error={err.confirm}>{(a) => <input {...a} type={show ? "text" : "password"} autoComplete="new-password" className="input" value={v.confirm} onChange={set("confirm")} />}</Field>
        <div>
          <label className="flex items-start gap-2 text-sm text-muted"><input type="checkbox" checked={v.terms} onChange={set("terms")} className="mt-0.5 size-4 accent-blue" />
            <span>I agree to the <Link to="/terms" className="text-cyan hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-cyan hover:underline">Privacy Policy</Link>.</span></label>
          {err.terms && <p className="mt-1.5 text-xs text-crit">{err.terms}</p>}
        </div>
        {err.form && (
          <div role="alert" className="rounded-lg border border-crit/30 bg-crit/10 px-3 py-2.5 text-sm text-crit">
            {err.form}
            {err.notConfigured && <p className="mt-1.5 text-ink">No account was created. <Link to="/onboarding" className="font-semibold text-cyan underline">Set up a sample workspace</Link> or <Link to="/#contact" className="font-semibold text-cyan underline">request early access</Link>.</p>}
          </div>
        )}
        <SubmitButton loading={loading}>Create Account</SubmitButton>
      </form>
    </AuthShell>
  );
}
