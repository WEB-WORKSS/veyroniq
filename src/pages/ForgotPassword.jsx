import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, KeyRound } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell.jsx";
import { Field, SubmitButton } from "../components/ui/primitives.jsx";
import { forgotPassword, confirmNewPassword, friendlyError, passwordStrength } from "../lib/auth.js";
import { isEmail } from "../lib/utils.js";

export default function ForgotPassword() {
  const [step, setStep] = useState("request");
  const [v, setV] = useState({ email: "", code: "", password: "" });
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const pw = passwordStrength(v.password);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const request = async (e) => {
    e?.preventDefault();
    if (!isEmail(v.email)) return setErr({ email: "Enter the email you signed up with." });
    setLoading(true); setErr({});
    try { await forgotPassword(v.email); setStep("reset"); }
    catch (ex) {
      // Don't reveal whether an account exists.
      if (ex.code === "UserNotFoundException") setStep("reset");
      else setErr({ form: friendlyError(ex) });
    } finally { setLoading(false); }
  };

  const reset = async (e) => {
    e.preventDefault();
    const x = {};
    if (!/^\d{6}$/.test(v.code.trim())) x.code = "Enter the 6-digit code from your email.";
    if (!pw.valid) x.password = "Use at least 10 characters with a mix of letters, numbers or symbols.";
    setErr(x);
    if (Object.keys(x).length) return;
    setLoading(true);
    try { await confirmNewPassword(v.email, v.code, v.password); setStep("done"); }
    catch (ex) { setErr({ form: friendlyError(ex), expired: ex.code === "ExpiredCodeException" }); }
    finally { setLoading(false); }
  };

  if (step === "done") return (
    <AuthShell title="Password updated" subtitle="You can now sign in with your new password.">
      <CheckCircle2 className="mb-6 size-9 text-ok" />
      <Link to="/login" className="btn btn-primary w-full">Back to sign in</Link>
    </AuthShell>
  );

  if (step === "reset") return (
    <AuthShell title="Set a new password" subtitle={`If an account exists for ${v.email}, we've emailed it a 6-digit code.`}>
      <form onSubmit={reset} noValidate className="space-y-4">
        <Field label="Code" error={err.code}>{(a) => <input {...a} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="input font-mono tracking-[0.4em]" value={v.code} onChange={set("code")} />}</Field>
        <Field label="New password" error={err.password} hint={v.password ? `Strength: ${pw.label}` : "At least 10 characters."}>{(a) => <input {...a} type="password" autoComplete="new-password" className="input" value={v.password} onChange={set("password")} />}</Field>
        {err.form && <div role="alert" className="rounded-lg border border-crit/30 bg-crit/10 px-3 py-2.5 text-sm text-crit">{err.form}{err.expired && <button type="button" onClick={request} className="ml-1 font-semibold text-cyan underline">Send a new code</button>}</div>}
        <SubmitButton loading={loading}>Update password</SubmitButton>
        <button type="button" onClick={() => setStep("request")} className="btn btn-ghost w-full">Use a different email</button>
      </form>
    </AuthShell>
  );

  return (
    <AuthShell title="Reset your password" subtitle="Enter your work email and we'll send you a code to set a new password."
      footer={<Link to="/login" className="font-semibold text-cyan hover:underline">Back to sign in</Link>}>
      <KeyRound className="mb-6 size-8 text-cyan" />
      <form onSubmit={request} noValidate className="space-y-4">
        <Field label="Work email" error={err.email}>{(a) => <input {...a} type="email" autoComplete="email" className="input" value={v.email} onChange={set("email")} />}</Field>
        {err.form && <p role="alert" className="rounded-lg border border-crit/30 bg-crit/10 px-3 py-2.5 text-sm text-crit">{err.form}</p>}
        <SubmitButton loading={loading}>Send reset code</SubmitButton>
      </form>
    </AuthShell>
  );
}
