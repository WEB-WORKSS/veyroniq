/* Veyroniq site + interactive prototype. All data below is fictional sample data. */
const CONTACT_EMAIL = "fawaz@veyroniq.site";

/* ---------- Nav, reveal ---------- */
const navEl = document.querySelector(".nav"), tgl = document.getElementById("navToggle"), links = document.getElementById("navLinks");
tgl.addEventListener("click", () => {
  const o = tgl.getAttribute("aria-expanded") !== "true";
  tgl.setAttribute("aria-expanded", String(o)); tgl.setAttribute("aria-label", o ? "Close menu" : "Open menu");
  links.classList.toggle("is-open", o);
});
links.addEventListener("click", e => { if (e.target.tagName === "A") { tgl.setAttribute("aria-expanded","false"); links.classList.remove("is-open"); } });
addEventListener("scroll", () => navEl.classList.toggle("is-scrolled", scrollY > 8), { passive:true });
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin:"0px 0px -8% 0px" }) : null;
document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("is-in"));

/* ---------- Helpers ---------- */
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Hero waveform ---------- */
(function hero(){
  const line = document.getElementById("heroWave"), fill = document.getElementById("heroWaveFill"), mv = document.getElementById("mVib");
  if (!line) return;
  const W = 600, H = 200, N = 120, r = rng(7);
  const pts = Array.from({ length:N }, (_, i) => sample(i));
  function sample(i){ const base = 5.2 + 0.6 * Math.sin(i / 9); return base + (r() - .5) * 1.6 + (r() < .04 ? 1.4 : 0); }
  const y = v => H - 10 - (v / 10) * (H - 20);
  let t = N;
  function draw(){
    const d = pts.map((v, i) => `${i ? "L" : "M"}${(i / (N - 1) * W).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    line.setAttribute("d", d); fill.setAttribute("d", `${d} L${W} ${H} L0 ${H} Z`);
    mv.textContent = pts[N - 1].toFixed(1);
  }
  draw();
  if (!reduce) setInterval(() => { pts.shift(); pts.push(sample(t++)); draw(); }, 110);
})();

/* ================= DEMO DATA ================= */
const LINES = ["Line 1", "Line 2", "Line 3", "Utilities"];
const A = [
  ["M-101","Main drive motor","Motor","Line 1",93],["P-102","Product pump","Pump","Line 1",88],["G-103","Conveyor gearbox","Gearbox","Line 1",86],["F-104","Dust extraction fan","Fan","Line 1",90],["C-105","Pneumatic compressor","Compressor","Line 1",68],
  ["M-201","Extruder motor","Motor","Line 2",91],["P-202","Coolant pump","Pump","Line 2",84],["G-203","Winder gearbox","Gearbox","Line 2",79],["M-204","Slitter motor","Motor","Line 2",89],["F-205","Oven circulation fan","Fan","Line 2",87],
  ["P-204","Transfer pump","Pump","Line 3",62],["M-311","Filler drive motor","Motor","Line 3",91],["G-118","Capper conveyor gearbox","Gearbox","Line 3",84],["C-402","Air compressor","Compressor","Line 3",38],["F-207","Exhaust fan","Fan","Line 3",88],
  ["C-501","Chiller compressor","Compressor","Utilities",82],["P-502","Cooling tower pump","Pump","Utilities",86],["B-503","Steam boiler feed pump","Pump","Utilities",null],["F-504","Cooling tower fan","Fan","Utilities",77],["P-505","Wastewater pump","Pump","Utilities",72]
];
const FORECAST = {
  "P-204": { comp:"Drive-end bearing wear", win:[18,26], conf:"Medium-high" },
  "C-402": { comp:"Inlet valve wear / overheating", win:[4,9], conf:"High" },
  "C-105": { comp:"Discharge valve leakage", win:[34,48], conf:"Medium" },
  "P-505": { comp:"Impeller wear", win:[41,60], conf:"Medium" },
  "G-203": { comp:"Gear tooth wear", win:[55,80], conf:"Low" }
};
const ASSETS = A.map(([id,name,type,line,health], i) => {
  const off = health == null;
  const st = off ? "off" : health >= 75 ? "ok" : health >= 50 ? "warn" : "crit";
  const r = rng(i * 31 + 5);
  const deg = off ? 0 : (100 - health) / 100;
  const vib = off ? null : +(1.6 + deg * 7 + r() * 0.8).toFixed(1);
  const temp = off ? null : +(48 + deg * 38 + r() * 6).toFixed(1);
  const pres = off ? null : type === "Pump" || type === "Compressor" ? +(3 + r() * 4).toFixed(1) : null;
  const runtime = Math.round(400 + r() * 3600);
  return { id, name, type, line, health, st, vib, temp, pres, runtime, seed:i * 13 + 3, fc:FORECAST[id] || null };
});
const byId = id => ASSETS.find(a => a.id === id);
function series(a, kind, n = 60){
  const r = rng(a.seed + kind.length * 101);
  const base = kind === "vib" ? a.vib : kind === "temp" ? a.temp : (a.pres ?? 0);
  if (base == null) return [];
  const deg = (100 - a.health) / 100;
  return Array.from({ length:n }, (_, i) => {
    const ramp = deg > .2 ? Math.pow(i / n, 3) * deg * base * 0.6 : 0;
    return Math.max(0, base - deg * base * 0.35 + ramp + (r() - .5) * base * 0.12);
  });
}
const LIMIT = { vib:7.1, temp:85, pres:7.5 };
const UNIT = { vib:"mm/s", temp:"°C", pres:"bar" };
const LABEL = { vib:"Vibration", temp:"Temperature", pres:"Pressure" };

let ALERTS = [
  { id:"AL-88", a:"C-402", sev:"crit", t:"Discharge temperature above learned range", d:"Temperature 18% above normal for current load; vibration rising in parallel.", age:12 },
  { id:"AL-87", a:"P-204", sev:"warn", t:"Drive-end bearing vibration trend", d:"Velocity up 31% over 14 days at constant speed.", age:95 },
  { id:"AL-86", a:"C-105", sev:"warn", t:"Pressure decay after unload", d:"Receiver pressure falls faster than baseline between cycles.", age:240 },
  { id:"AL-85", a:"P-505", sev:"warn", t:"Flow-to-power ratio declining", d:"More power needed for the same flow; consistent with impeller wear.", age:410 },
  { id:"AL-84", a:"B-503", sev:"info", t:"Sensor offline", d:"No data received from vibration sensor for 6 hours.", age:380 },
  { id:"AL-83", a:"G-203", sev:"info", t:"Gear-mesh frequency sidebands", d:"Low-amplitude sidebands detected; monitoring.", age:1300 }
].map(x => ({ ...x, ack:false }));
let RECS = [
  { id:"REC-0417", a:"C-402", p:1, t:"Replace inlet valve kit and clean intercooler", c:"Inlet valve wear causing overheating", parts:"Valve kit, gasket set", dur:"3.5 h", done:null },
  { id:"REC-0416", a:"P-204", p:2, t:"Replace drive-end bearing, check alignment", c:"Bearing wear; possible misalignment", parts:"Bearing 6309-2Z, coupling insert", dur:"2.5 h", done:null },
  { id:"REC-0415", a:"C-105", p:3, t:"Inspect discharge valve and check for leaks", c:"Valve leakage, possible air leaks downstream", parts:"Discharge valve kit", dur:"2 h", done:null },
  { id:"REC-0414", a:"P-505", p:4, t:"Inspect impeller at next planned stop", c:"Impeller wear reducing efficiency", parts:"Impeller (if worn)", dur:"4 h", done:null },
  { id:"REC-0413", a:"B-503", p:5, t:"Restore sensor connection", c:"Sensor or gateway communication fault", parts:"None expected", dur:"0.5 h", done:null }
];
const SLOTS = ["Next planned stop", "This weekend", "Next week"];
const SEV = { crit:"sev-crit", warn:"sev-warn", info:"sev-info" };
const STAT = { ok:["Healthy","var(--ok)"], warn:["Watch","var(--warn)"], crit:["Act now","var(--crit)"], off:["Offline","var(--off)"] };
const ago = m => m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m/60)} h ago` : `${Math.round(m/1440)} d ago`;

const S = { view:"overview", q:"", line:"", st:"", asc:true, range:90, sig:"vib" };
const main = document.getElementById("appMain"), drawer = document.getElementById("drawer"), dIn = document.getElementById("drawerIn");

function badges(){
  document.getElementById("bAlerts").textContent = ALERTS.filter(a => !a.ack).length || "";
  document.getElementById("bRecs").textContent = RECS.filter(r => !r.done).length || "";
}
function go(v){ S.view = v; document.querySelectorAll(".app__nav button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view === v))); closeD(); render(); }
function render(){ badges(); ({ overview, assets, alerts, maintenance, analytics })[S.view](); }
const stPill = st => `<span class="st" style="color:${STAT[st][1]}"><i style="background:${STAT[st][1]}"></i>${STAT[st][0]}</span>`;
function spark(a){
  const s = series(a, "vib", 30); if (!s.length) return `<span class="t2">No data</span>`;
  const mx = Math.max(...s, LIMIT.vib) * 1.05;
  return `<svg class="spark" viewBox="0 0 90 26" preserveAspectRatio="none"><path d="${s.map((v,i)=>`${i?"L":"M"}${(i/29*90).toFixed(1)} ${(26-v/mx*24).toFixed(1)}`).join(" ")}"/></svg>`;
}

/* Overview */
function overview(){
  const crit = ASSETS.filter(a => a.st === "crit").length, open = ALERTS.filter(a => !a.ack).length;
  const fc30 = ASSETS.filter(a => a.fc && a.fc.win[0] <= 30).length;
  const live = ASSETS.filter(a => a.st !== "off").length;
  main.innerHTML = `
    <div class="vh"><div><h3>Plant overview</h3><p>${ASSETS.length} assets across ${LINES.length} areas · sample data</p></div></div>
    <div class="kpis">
      <button class="kpi" data-go="assets"><span>Assets monitored</span><b>${ASSETS.length}</b><em>${live} streaming</em></button>
      <button class="kpi" data-go="assets" data-st="crit"><span>Need action now</span><b class="t-crit">${crit}</b><em>Health below 50</em></button>
      <button class="kpi" data-go="alerts"><span>Open alerts</span><b>${open}</b><em>Unacknowledged</em></button>
      <button class="kpi" data-go="maintenance"><span>Forecast failures ≤30 days</span><b class="t-warn">${fc30}</b><em>With recommended work</em></button>
    </div>
    <div class="panels">
      <div class="panel"><h4>Asset health by area <span class="t2">Select an asset</span></h4>
        <div class="lines">${LINES.map(l => `<div class="lrow"><span>${l}</span><div class="cells">${ASSETS.filter(a => a.line === l).map(a => `<button class="cell ${a.st}" data-open="${a.id}" title="${esc(a.name)} · ${a.health ?? "offline"}" aria-label="${esc(a.id + " " + a.name)}, ${STAT[a.st][0]}">${a.id.split("-")[0]}</button>`).join("")}</div></div>`).join("")}</div>
        <div class="floor__key" style="margin-top:16px"><span><i class="ok"></i>Healthy</span><span><i class="warn"></i>Watch</span><span><i class="crit"></i>Act now</span><span><i class="off"></i>Offline</span></div>
      </div>
      <div class="panel"><h4>Latest alerts</h4>
        <div class="alist">${ALERTS.filter(a => !a.ack).slice(0,5).map(a => `<button class="arow" data-open="${a.a}"><i class="${SEV[a.sev]}"></i><span>${a.a} · ${esc(a.t)}</span><em>${ago(a.age)}</em></button>`).join("") || `<p class="t2">No open alerts.</p>`}</div>
      </div>
    </div>`;
}

/* Assets */
function filtered(){
  const q = S.q.trim().toLowerCase();
  return ASSETS.filter(a => (!S.line || a.line === S.line) && (!S.st || a.st === S.st) && (!q || [a.id,a.name,a.type,a.line].join(" ").toLowerCase().includes(q)))
    .sort((x,y) => ((x.health ?? -1) - (y.health ?? -1)) * (S.asc ? 1 : -1));
}
function assets(){
  main.innerHTML = `
    <div class="vh"><div><h3>Assets</h3><p>Sorted by health, lowest first</p></div></div>
    <div class="toolbar">
      <input type="search" id="aq" placeholder="Filter assets" value="${esc(S.q)}" aria-label="Filter assets">
      <select id="al" aria-label="Area"><option value="">All areas</option>${LINES.map(l => `<option ${l===S.line?"selected":""}>${l}</option>`).join("")}</select>
      <div class="seg" role="group" aria-label="Status">${[["","All"],["ok","Healthy"],["warn","Watch"],["crit","Act now"],["off","Offline"]].map(([k,l]) => `<button data-fst="${k}" aria-pressed="${S.st===k}">${l}</button>`).join("")}</div>
    </div><div id="at"></div>`;
  table();
  document.getElementById("aq").addEventListener("input", e => { S.q = e.target.value; document.getElementById("gSearch").value = S.q; table(); });
  document.getElementById("al").addEventListener("change", e => { S.line = e.target.value; table(); });
}
function table(){
  const el = document.getElementById("at"); if (!el) return;
  const rows = filtered();
  el.innerHTML = rows.length ? `<table class="tbl"><thead><tr><th>Asset</th><th class="hide-sm">Area</th><th><button id="hs">Health ${S.asc?"↑":"↓"}</button></th><th class="hide-sm">Vibration 30d</th><th class="hide-sm">Forecast</th><th>Status</th></tr></thead><tbody>${rows.map(a => `
    <tr data-open="${a.id}" tabindex="0">
      <td><div class="t1">${esc(a.name)}</div><div class="t2">${a.id} · ${a.type}</div></td>
      <td class="hide-sm">${a.line}</td>
      <td>${a.health == null ? `<span class="t2">n/a</span>` : `<span class="hbar" style="color:${STAT[a.st][1]}"><i style="--h:${a.health}%"></i>${a.health}</span>`}</td>
      <td class="hide-sm">${spark(a)}</td>
      <td class="hide-sm">${a.fc ? `<div class="t1" style="font-size:.8rem">${a.fc.win[0]}–${a.fc.win[1]} days</div><div class="t2">${esc(a.fc.comp)}</div>` : `<span class="t2">No failure forecast</span>`}</td>
      <td>${stPill(a.st)}</td></tr>`).join("")}</tbody></table><p class="count">${rows.length} of ${ASSETS.length} assets</p>` : `<div class="empty">No assets match these filters.</div>`;
  const hs = document.getElementById("hs"); if (hs) hs.addEventListener("click", e => { e.stopPropagation(); S.asc = !S.asc; table(); });
}

/* Alerts */
function alerts(){
  main.innerHTML = `<div class="vh"><div><h3>Alerts</h3><p>Anomalies detected against each asset's learned behaviour</p></div></div>
    ${ALERTS.map(a => `<div class="alert ${a.ack ? "is-ack" : ""}"><i class="${SEV[a.sev]}"></i>
      <div><h5>${esc(a.t)}</h5><p>${a.a} ${esc(byId(a.a).name)} · ${byId(a.a).line} · ${ago(a.age)}</p><p>${esc(a.d)}</p></div>
      <div class="acts"><button class="sbtn" data-open="${a.a}">View asset</button>${a.ack ? `<span class="t2">Acknowledged</span>` : `<button class="sbtn sbtn--p" data-ack="${a.id}">Acknowledge</button>`}</div></div>`).join("")}`;
}

/* Maintenance */
function maintenance(){
  main.innerHTML = `<div class="vh"><div><h3>Recommended maintenance</h3><p>Ranked by risk to production. Scheduling here is part of the prototype.</p></div></div>
    ${RECS.map(r => { const a = byId(r.a); return `<div class="rec ${r.done ? "is-done" : ""}">
      <div class="rec__p" style="color:${r.p===1?"var(--crit)":r.p<=3?"var(--warn)":"var(--blue-2)"}">P${r.p}</div>
      <div><h5>${esc(r.t)}</h5><p>${r.a} ${esc(a.name)} · ${a.line} · Likely cause: ${esc(r.c)}</p>
        <div class="meta"><span>Parts: ${esc(r.parts)}</span><span>Est. ${r.dur}</span><span>${r.id}</span></div></div>
      <div class="acts">${r.done ? `<span class="st" style="color:var(--ok)"><i style="background:var(--ok)"></i>Scheduled · ${r.done}</span>`
        : `<select data-slot="${r.id}" aria-label="When to schedule ${r.id}">${SLOTS.map(s => `<option>${s}</option>`).join("")}</select><button class="sbtn sbtn--p" data-sched="${r.id}">Schedule</button>`}
        <button class="sbtn" data-open="${r.a}">Asset</button></div></div>`; }).join("")}`;
}

/* Analytics */
function analytics(){
  const k = S.range / 90;
  const causes = [["Bearing failure",41],["Seal leakage",28],["Motor overheating",19],["Belt / coupling",13],["Electrical",8],["Sensor / controls",5]].map(([c,h]) => [c, Math.round(h * k)]);
  const max = Math.max(...causes.map(c => c[1]));
  const W = 560, H = 220, bw = 60, gap = (W - 40 - causes.length * bw) / (causes.length - 1);
  const weeks = Math.round(S.range / 7), r = rng(S.range);
  const wk = Array.from({ length:weeks }, (_, i) => +(2 + r() * 5 + (i % 5 === 3 ? 4 : 0)).toFixed(1));
  const wmax = Math.max(...wk) * 1.15;
  const total = causes.reduce((s,c) => s + c[1], 0);
  main.innerHTML = `
    <div class="vh"><div><h3>Downtime &amp; performance</h3><p>Sample plant · last ${S.range} days</p></div>
      <div class="seg" role="group" aria-label="Range">${[30,90].map(d => `<button data-range="${d}" aria-pressed="${S.range===d}">${d} days</button>`).join("")}</div></div>
    <div class="mini"><div><span>Unplanned downtime</span><b>${total} h</b></div><div><span>Availability</span><b>${(100 - total / (S.range * 24) * 100 * 1.6).toFixed(1)}%</b></div><div><span>Mean time between failures</span><b>${Math.round(260 + 60 * k)} h</b></div></div>
    <div class="panels">
      <div class="panel"><h4>Unplanned downtime by cause</h4>
        <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart of downtime hours by cause">
          <defs><linearGradient id="gb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2F6BFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>
          ${[0,.5,1].map(f => `<line class="gl" x1="30" x2="${W}" y1="${170 - f*140}" y2="${170 - f*140}"/><text class="ax" x="0" y="${174 - f*140}">${Math.round(max*f)}</text>`).join("")}
          ${causes.map(([c,h],i) => { const x = 40 + i*(bw+gap), bh = h/max*140; return `<g><title>${c}: ${h} h</title><rect class="bar" x="${x}" y="${170-bh}" width="${bw}" height="${bh}" rx="4"/><text class="ax" x="${x+bw/2}" y="${165-bh}" text-anchor="middle" fill="#fff">${h}h</text><text class="ax" x="${x+bw/2}" y="190" text-anchor="middle">${c.split(" ")[0]}</text></g>`; }).join("")}
        </svg></div>
      <div class="panel"><h4>Weekly unplanned downtime (h)</h4>
        <svg class="chart" viewBox="0 0 300 220" preserveAspectRatio="none" role="img" aria-label="Line chart of weekly downtime">
          ${[0,.5,1].map(f => `<line class="gl" x1="0" x2="300" y1="${200 - f*180}" y2="${200 - f*180}"/>`).join("")}
          <path class="area" d="${wk.map((v,i)=>`${i?"L":"M"}${(i/(weeks-1)*300).toFixed(1)} ${(200 - v/wmax*180).toFixed(1)}`).join(" ")} L300 200 L0 200 Z"/>
          <path class="ln" d="${wk.map((v,i)=>`${i?"L":"M"}${(i/(weeks-1)*300).toFixed(1)} ${(200 - v/wmax*180).toFixed(1)}`).join(" ")}"/>
        </svg></div>
    </div>`;
}

/* Drawer */
let lastF = null;
function openD(id){
  const a = byId(id); if (!a) return;
  lastF = document.activeElement;
  const sigs = ["vib","temp","pres"].filter(k => (k === "vib" ? a.vib : k === "temp" ? a.temp : a.pres) != null);
  if (!sigs.includes(S.sig)) S.sig = sigs[0] || "vib";
  const s = series(a, S.sig);
  let chart = `<div class="empty">Sensor offline. No recent data.</div>`;
  if (s.length) {
    const lim = LIMIT[S.sig], mx = Math.max(...s, lim) * 1.12, y = v => (200 - v / mx * 185).toFixed(1);
    const d = s.map((v,i)=>`${i?"L":"M"}${(i/(s.length-1)*420).toFixed(1)} ${y(v)}`).join(" ");
    chart = `<svg class="chart" viewBox="0 0 420 210" preserveAspectRatio="none" role="img" aria-label="${LABEL[S.sig]} over 60 days">
      <line class="thr" x1="0" x2="420" y1="${y(lim)}" y2="${y(lim)}"/><path class="area" d="${d} L420 210 L0 210 Z"/><path class="ln" d="${d}"/></svg>
      <p class="t2" style="display:flex;justify-content:space-between"><span>60 days ago</span><span>Alert limit ${lim} ${UNIT[S.sig]}</span><span>Now</span></p>`;
  }
  dIn.innerHTML = `<button class="dclose" aria-label="Close details">×</button>
    <span class="mono" style="color:var(--faint)">${a.id} · ${a.type} · ${a.line}</span>
    <h3>${esc(a.name)}</h3>${stPill(a.st)}
    <div class="dtabs" role="group" aria-label="Signal">${sigs.map(k => `<button data-sig="${k}" data-asset="${a.id}" aria-pressed="${S.sig===k}">${LABEL[k]}</button>`).join("")}</div>
    ${chart}
    ${a.fc ? `<div class="dfc"><b>Forecast: ${esc(a.fc.comp)}</b><br>Likely failure window ${a.fc.win[0]}–${a.fc.win[1]} days · confidence ${a.fc.conf.toLowerCase()}</div>` : ""}
    <dl>
      <dt>Health score</dt><dd>${a.health ?? "n/a"}</dd>
      <dt>Vibration</dt><dd>${a.vib != null ? a.vib + " mm/s RMS" : "n/a"}</dd>
      <dt>Temperature</dt><dd>${a.temp != null ? a.temp + " °C" : "n/a"}</dd>
      <dt>Pressure</dt><dd>${a.pres != null ? a.pres + " bar" : "Not measured"}</dd>
      <dt>Runtime since service</dt><dd>${a.runtime.toLocaleString("en-GB")} h</dd>
    </dl>
    <div class="hist"><div><span>Today</span>Health ${a.health ?? "n/a"} recorded</div><div><span>21 days ago</span>Routine lubrication completed</div><div><span>5 months ago</span>Preventive inspection, no defects found</div><div><span>14 months ago</span>Component replaced after failure</div></div>`;
  drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden","false");
  dIn.querySelector(".dclose").focus();
}
function closeD(){ if (!drawer.classList.contains("is-open")) return; drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden","true"); if (lastF) lastF.focus(); }

/* Events */
document.querySelector(".app__nav").addEventListener("click", e => { const b = e.target.closest("[data-view]"); if (b) go(b.dataset.view); });
const app = document.getElementById("app");
app.addEventListener("click", e => {
  const t = e.target;
  if (t.closest(".dclose")) return closeD();
  const sg = t.closest("[data-sig]"); if (sg) { S.sig = sg.dataset.sig; return openD(sg.dataset.asset); }
  const g = t.closest("[data-go]"); if (g) { if (g.dataset.st) { S.st = g.dataset.st; S.q = ""; S.line = ""; } else if (g.dataset.go === "assets") S.st = ""; return go(g.dataset.go); }
  const o = t.closest("[data-open]"); if (o) return openD(o.dataset.open);
  const f = t.closest("[data-fst]"); if (f) { S.st = f.dataset.fst; document.querySelectorAll("[data-fst]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.fst === S.st))); return table(); }
  const ak = t.closest("[data-ack]"); if (ak) { ALERTS.find(x => x.id === ak.dataset.ack).ack = true; return render(); }
  const sc = t.closest("[data-sched]"); if (sc) { const r = RECS.find(x => x.id === sc.dataset.sched); r.done = document.querySelector(`[data-slot="${r.id}"]`).value; return render(); }
  const rg = t.closest("[data-range]"); if (rg) { S.range = +rg.dataset.range; return analytics(); }
});
app.addEventListener("keydown", e => {
  if (e.key === "Escape") closeD();
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("tr[data-open]")) { e.preventDefault(); openD(e.target.dataset.open); }
});
const gs = document.getElementById("gSearch");
gs.addEventListener("input", () => {
  S.q = gs.value;
  if (S.view !== "assets") { S.st = ""; S.line = ""; go("assets"); gs.focus(); }
  else { const q = document.getElementById("aq"); if (q) q.value = gs.value; table(); }
});
render();

/* ---------- Early access form ---------- */
const form = document.getElementById("accessForm"), fst = document.getElementById("formSt");
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach(f => {
    const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
    f.setAttribute("aria-invalid", String(bad)); if (bad) ok = false;
  });
  if (!ok) { fst.className = "form__st err"; fst.textContent = "Please complete the highlighted fields."; return; }
  const d = Object.fromEntries(new FormData(form));
  const body = `Name: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company}\nIndustry: ${d.industry}\nCritical assets: ${d.assets || "-"}\n\n${d.message || ""}`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Veyroniq early access: " + d.company)}&body=${encodeURIComponent(body)}`;
  fst.className = "form__st ok"; fst.textContent = "Your email app should open with the request ready to send.";
});
