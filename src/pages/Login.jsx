import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell.jsx";
import { Field, SubmitButton } from "../components/ui/primitives.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { friendlyError } from "../lib/auth.js";
import { isEmail } from "../lib/utils.js";

export default function Login() {
  const { signIn, user } = useAuth();
  const nav = useNavigate();
  const [v, setV] = useState({ email: "", password: "", remember: true });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (!isEmail(v.email)) x.email = "Enter a valid email address.";
    if (!v.password) x.password = "Enter your password.";
    setErr(x);
    if (Object.keys(x).length) return;
    setLoading(true);
    try {
      await signIn(v.email, v.password, v.remember);
      nav("/dashboard", { replace: true });
    } catch (ex) {
      setErr({ form: friendlyError(ex) });
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Veyroniq workspace." demoCta={{ to: "/dashboard", label: "Open the sample workspace" }}
      footer={<>New to Veyroniq? <Link to="/signup" className="font-semibold text-cyan hover:underline">Create an account</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Work email" error={err.email}>{(a) => <input {...a} type="email" autoComplete="email" className="input" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />}</Field>
        <Field label="Password" error={err.password}>{(a) => (
          <div className="relative">
            <input {...a} type={show ? "text" : "password"} autoComplete="current-password" className="input pr-10" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-faint hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          </div>
        )}</Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted"><input type="checkbox" checked={v.remember} onChange={(e) => setV({ ...v, remember: e.target.checked })} className="size-4 accent-blue" />Remember me</label>
          <Link to="/forgot-password" className="text-cyan hover:underline">Forgot password?</Link>
        </div>
        {err.form && <p role="alert" className="rounded-lg border border-crit/30 bg-crit/10 px-3 py-2.5 text-sm text-crit">{err.form}</p>}
        <SubmitButton loading={loading}>Sign In</SubmitButton>
      </form>
    </AuthShell>
  );
}
