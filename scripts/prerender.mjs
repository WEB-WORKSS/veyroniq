// Prerenders public marketing routes to static HTML so content is crawlable without JavaScript.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const { headTags, publicRoutes, routeMeta } = await import(pathToFileURL(path.resolve("src/lib/seo.js")).href);

const page = (route, body) => template.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, headTags(route)).replace("<!--app-->", body ?? "");

for (const route of publicRoutes) {
  const out = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(route, render(route)));
  console.log("prerendered", route);
}
// Client-rendered routes get their own shell so the title/description/robots are correct before JS runs.
for (const route of Object.keys(routeMeta).filter((r) => !publicRoutes.includes(r))) {
  const out = path.join(dist, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(route, ""));
}
// SPA shell for any other client routes (login, dashboard, …) and 404s — no marketing body, noindex via route meta.
fs.writeFileSync(path.join(dist, "200.html"), page("/404", ""));
fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });
