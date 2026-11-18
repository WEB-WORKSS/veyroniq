import { useEffect } from "react";
import { metaFor } from "../lib/seo.js";

/** Keeps <title>, description and robots in sync on client-side navigation. Prerendered pages ship them in HTML. */
export function useSeo(path) {
  useEffect(() => {
    const m = metaFor(path);
    document.title = m.title;
    const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', "content", m.description);
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.content = m.noindex ? "noindex, nofollow" : "index, follow";
  }, [path]);
}
