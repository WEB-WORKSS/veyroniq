import { business } from "../data/business.js";

export const routeMeta = {
  "/": { title: `${business.name} | Predictive maintenance for industrial equipment`, description: "Veyroniq is predictive maintenance software that reads vibration, temperature, pressure and maintenance history to flag abnormal machine behaviour, estimate failure windows and rank what to fix first." },
  "/privacy": { title: `Privacy Policy | ${business.name}`, description: "How Veyroniq collects, uses, stores and protects personal information on veyroniq.site and in the Veyroniq application." },
  "/terms": { title: `Terms of Service | ${business.name}`, description: "The terms that apply when you use veyroniq.site and the Veyroniq predictive maintenance application." },
  "/login": { title: `Sign in | ${business.name}`, description: "Sign in to your Veyroniq workspace.", noindex: true },
  "/signup": { title: `Create account | ${business.name}`, description: "Create a Veyroniq account.", noindex: true },
  "/forgot-password": { title: `Reset password | ${business.name}`, description: "Reset your Veyroniq password.", noindex: true },
  "/onboarding": { title: `Set up workspace | ${business.name}`, description: "Set up your Veyroniq workspace.", noindex: true },
  "/dashboard": { title: `Workspace | ${business.name}`, description: "Veyroniq maintenance workspace.", noindex: true },
  "/app": { title: `Application center | ${business.name}`, description: "Private.", noindex: true },
};

export const publicRoutes = ["/", "/privacy", "/terms"];

export function metaFor(path) {
  return routeMeta[path] || { title: `Page not found | ${business.name}`, description: "This page doesn't exist.", noindex: true };
}

export function headTags(path) {
  const m = metaFor(path);
  const url = `${business.url}${path === "/" ? "/" : path}`;
  const e = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return [
    `<title>${e(m.title)}</title>`,
    `<meta name="description" content="${e(m.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${e(m.title)}">`,
    `<meta property="og:description" content="${e(m.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta name="twitter:title" content="${e(m.title)}">`,
    `<meta name="twitter:description" content="${e(m.description)}">`,
    m.noindex ? `<meta name="robots" content="noindex, nofollow">` : `<meta name="robots" content="index, follow">`,
  ].join("\n");
}
