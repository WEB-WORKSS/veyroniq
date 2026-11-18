/**
 * Amazon Cognito authentication (user pool, SRP sign-in).
 *
 * Integration-ready: when VITE_COGNITO_USER_POOL_ID / VITE_COGNITO_CLIENT_ID are not set,
 * `authConfigured` is false and every call rejects with AuthNotConfiguredError. The UI then
 * explains that accounts aren't open yet instead of pretending to sign anyone in.
 *
 * Status: written against amazon-cognito-identity-js v6, NOT yet tested against a live user pool.
 */
const POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || "";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "";
export const ADMIN_GROUP = import.meta.env.VITE_ADMIN_GROUP || "admin";
export const authConfigured = Boolean(POOL_ID && CLIENT_ID);

export class AuthNotConfiguredError extends Error {
  constructor() {
    super("Accounts aren't open yet. Sign-in will be enabled when early access starts.");
    this.code = "NotConfigured";
  }
}

const REMEMBER_KEY = "vq.remember";
let lib;
async function cognito() {
  if (!authConfigured) throw new AuthNotConfiguredError();
  lib ||= await import("amazon-cognito-identity-js");
  return lib;
}
function storage() {
  try { return localStorage.getItem(REMEMBER_KEY) === "0" ? sessionStorage : localStorage; } catch { return undefined; }
}
async function pool() {
  const { CognitoUserPool } = await cognito();
  return new CognitoUserPool({ UserPoolId: POOL_ID, ClientId: CLIENT_ID, Storage: storage() });
}
async function userFor(email) {
  const { CognitoUser } = await cognito();
  return new CognitoUser({ Username: email.trim().toLowerCase(), Pool: await pool(), Storage: storage() });
}

/** Map Cognito error codes to messages people can act on. */
export function friendlyError(err) {
  const map = {
    NotConfigured: err?.message,
    UserNotFoundException: "We couldn't find an account with that email.",
    NotAuthorizedException: "Email or password is incorrect.",
    UserNotConfirmedException: "Please confirm your email first. Check your inbox for the code.",
    UsernameExistsException: "An account with this email already exists. Try signing in.",
    InvalidPasswordException: "Password doesn't meet the requirements.",
    CodeMismatchException: "That code isn't right. Check the latest email and try again.",
    ExpiredCodeException: "That code has expired. Request a new one.",
    LimitExceededException: "Too many attempts. Please wait a few minutes and try again.",
    TooManyRequestsException: "Too many attempts. Please wait a few minutes and try again.",
    NetworkError: "Can't reach the sign-in service. Check your connection.",
  };
  return map[err?.code || err?.name] || err?.message || "Something went wrong. Please try again.";
}

function sessionToUser(session) {
  const p = session.getIdToken().decodePayload();
  return {
    id: p.sub, email: p.email, name: p.name || p.email,
    groups: p["cognito:groups"] || [],
    isAdmin: (p["cognito:groups"] || []).includes(ADMIN_GROUP),
    idToken: session.getIdToken().getJwtToken(),
  };
}

export async function signUp({ name, email, password }) {
  const { CognitoUserAttribute } = await cognito();
  const p = await pool();
  const attrs = [new CognitoUserAttribute({ Name: "email", Value: email.trim().toLowerCase() }), new CognitoUserAttribute({ Name: "name", Value: name.trim() })];
  return new Promise((res, rej) => p.signUp(email.trim().toLowerCase(), password, attrs, null, (e, r) => (e ? rej(e) : res(r))));
}

export async function confirmSignUp(email, code) {
  const u = await userFor(email);
  return new Promise((res, rej) => u.confirmRegistration(code.trim(), true, (e, r) => (e ? rej(e) : res(r))));
}

export async function resendCode(email) {
  const u = await userFor(email);
  return new Promise((res, rej) => u.resendConfirmationCode((e, r) => (e ? rej(e) : res(r))));
}

export async function signIn(email, password, remember = true) {
  try { localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0"); } catch {}
  const { AuthenticationDetails } = await cognito();
  const u = await userFor(email);
  const details = new AuthenticationDetails({ Username: email.trim().toLowerCase(), Password: password });
  return new Promise((res, rej) =>
    u.authenticateUser(details, {
      onSuccess: (s) => res(sessionToUser(s)),
      onFailure: rej,
      newPasswordRequired: () => rej(Object.assign(new Error("A new password is required. Use “Forgot password” to set one."), { code: "NewPasswordRequired" })),
    })
  );
}

export async function currentUser() {
  if (!authConfigured) return null;
  const p = await pool();
  const u = p.getCurrentUser();
  if (!u) return null;
  return new Promise((res) => u.getSession((e, s) => res(!e && s?.isValid() ? sessionToUser(s) : null)));
}

/** Revokes refresh tokens server-side (globalSignOut), then clears local tokens. */
export async function signOut() {
  if (!authConfigured) return;
  const p = await pool();
  const u = p.getCurrentUser();
  if (!u) return;
  await new Promise((res) => u.getSession(() => u.globalSignOut({ onSuccess: res, onFailure: res })));
  u.signOut();
}

export async function forgotPassword(email) {
  const u = await userFor(email);
  return new Promise((res, rej) => u.forgotPassword({ onSuccess: res, onFailure: rej, inputVerificationCode: res }));
}

export async function confirmNewPassword(email, code, password) {
  const u = await userFor(email);
  return new Promise((res, rej) => u.confirmPassword(code.trim(), password, { onSuccess: res, onFailure: rej }));
}

export function passwordStrength(pw = "") {
  const checks = [
    { ok: pw.length >= 10, label: "10+ characters" },
    { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: "Upper & lower case" },
    { ok: /\d/.test(pw), label: "A number" },
    { ok: /[^A-Za-z0-9]/.test(pw), label: "A symbol" },
  ];
  const score = checks.filter((c) => c.ok).length;
  return { checks, score, label: ["Too weak", "Weak", "Fair", "Good", "Strong"][score], valid: checks[0].ok && score >= 3 };
}
