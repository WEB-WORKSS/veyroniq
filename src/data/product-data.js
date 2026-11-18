// Fictional sample data for the demo workspace "Ridgeway Packaging · Plant 2".
// Nothing here describes a real customer, plant or reading.

export function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SAMPLE_WORKSPACE = { name: "Ridgeway Packaging · Plant 2", org: "Ridgeway Packaging (sample)", industry: "Manufacturing" };
export const LINES = ["Line 1", "Line 2", "Line 3", "Utilities"];
export const ASSET_TYPES = ["Motor", "Pump", "Gearbox", "Compressor", "Fan", "Conveyor"];
export const CRITICALITY = ["High", "Medium", "Low"];
export const WO_STATUS = ["Open", "Scheduled", "In progress", "Done"];
export const PRIORITY = ["P1", "P2", "P3"];
export const TECHS = ["A. Moreno", "J. Okafor", "L. Chen", "R. Patel", "Unassigned"];

const RAW = [
  ["M-101", "Main drive motor", "Motor", "Line 1", 93, "High"], ["P-102", "Product pump", "Pump", "Line 1", 88, "High"],
  ["G-103", "Conveyor gearbox", "Gearbox", "Line 1", 86, "Medium"], ["F-104", "Dust extraction fan", "Fan", "Line 1", 90, "Low"],
  ["C-105", "Pneumatic compressor", "Compressor", "Line 1", 68, "High"], ["M-201", "Extruder motor", "Motor", "Line 2", 91, "High"],
  ["P-202", "Coolant pump", "Pump", "Line 2", 84, "Medium"], ["G-203", "Winder gearbox", "Gearbox", "Line 2", 72, "Medium"],
  ["M-204", "Slitter motor", "Motor", "Line 2", 89, "Medium"], ["F-205", "Oven circulation fan", "Fan", "Line 2", 87, "Low"],
  ["P-204", "Transfer pump", "Pump", "Line 3", 62, "High"], ["M-311", "Filler drive motor", "Motor", "Line 3", 91, "High"],
  ["G-118", "Capper conveyor gearbox", "Gearbox", "Line 3", 84, "Medium"], ["C-402", "Air compressor", "Compressor", "Line 3", 38, "High"],
  ["F-207", "Exhaust fan", "Fan", "Line 3", 88, "Low"], ["C-501", "Chiller compressor", "Compressor", "Utilities", 82, "High"],
  ["P-502", "Cooling tower pump", "Pump", "Utilities", 86, "Medium"], ["P-503", "Boiler feed pump", "Pump", "Utilities", 79, "High"],
  ["F-504", "Cooling tower fan", "Fan", "Utilities", 77, "Low"], ["P-505", "Wastewater pump", "Pump", "Utilities", 58, "Medium"],
];

export const FORECASTS = {
  "P-204": { component: "Drive-end bearing wear", window: [18, 26], confidence: "Medium-high", cause: "Correlated rise in vibration and bearing temperature at constant load", action: "Replace drive-end bearing at the planned stop on Line 3. Check shaft alignment.", parts: "Bearing 6309-2RS, seal kit", hours: 4 },
  "C-402": { component: "Inlet valve wear / overheating", window: [4, 9], confidence: "High", cause: "Discharge temperature 14 °C above baseline with rising vibration", action: "Inspect inlet valve and seat; check intercooler for fouling.", parts: "Valve kit, gasket set", hours: 3.5 },
  "C-105": { component: "Discharge valve leakage", window: [34, 48], confidence: "Medium", cause: "Longer load cycles for the same air demand", action: "Leak-test discharge valve at next weekly stop.", parts: "Discharge valve plate", hours: 2 },
  "P-505": { component: "Impeller wear", window: [41, 60], confidence: "Medium", cause: "Falling discharge pressure at constant speed", action: "Plan impeller inspection; check for solids ingress.", parts: "Impeller, wear ring", hours: 5 },
  "G-203": { component: "Gear tooth wear", window: [55, 80], confidence: "Low", cause: "Gear-mesh vibration band slowly rising", action: "Take oil sample and borescope inspection.", parts: "Oil sample kit", hours: 1.5 },
};

export const statusOf = (h) => (h == null ? "offline" : h >= 75 ? "healthy" : h >= 50 ? "watch" : "act");

const iso = (d) => d.toISOString().slice(0, 10);
const daysFrom = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

export function seedWorkspace() {
  const assets = RAW.map(([id, name, type, line, health, criticality], i) => {
    const r = rng(i * 31 + 5);
    const deg = (100 - health) / 100;
    return {
      id, name, type, line, health, criticality,
      vibration: +(1.6 + deg * 7 + r() * 0.8).toFixed(1),
      temperature: +(48 + deg * 38 + r() * 6).toFixed(1),
      runtimeHours: Math.round(400 + r() * 2600),
      lastService: daysFrom(-Math.round(20 + r() * 300)),
      notes: "",
    };
  });

  const alerts = Object.entries(FORECASTS).map(([assetId, fc], i) => ({
    id: `AL-${1040 + i}`, assetId, title: fc.component, detail: fc.cause,
    severity: fc.window[0] < 10 ? "critical" : fc.window[0] < 30 ? "warning" : "info",
    status: "open", createdAt: daysFrom(-(i + 1)),
  }));

  const workOrders = [
    { id: "WO-2301", assetId: "C-402", title: "Inspect inlet valve and intercooler", priority: "P1", status: "Scheduled", assignee: "J. Okafor", due: daysFrom(2), hours: 3.5 },
    { id: "WO-2302", assetId: "P-204", title: "Replace drive-end bearing", priority: "P1", status: "Open", assignee: "A. Moreno", due: daysFrom(9), hours: 4 },
    { id: "WO-2298", assetId: "M-201", title: "Quarterly motor insulation test", priority: "P3", status: "Done", assignee: "L. Chen", due: daysFrom(-6), hours: 1 },
    { id: "WO-2303", assetId: "G-203", title: "Oil sample and borescope", priority: "P2", status: "In progress", assignee: "R. Patel", due: daysFrom(4), hours: 1.5 },
    { id: "WO-2299", assetId: "F-504", title: "Belt tension and alignment check", priority: "P3", status: "Open", assignee: "Unassigned", due: daysFrom(-1), hours: 1 },
  ];

  const inspections = [
    { id: "IN-501", assetId: "C-501", title: "Chiller compressor oil level", frequency: "Weekly", due: daysFrom(1), status: "Due", result: "" },
    { id: "IN-502", assetId: "P-102", title: "Seal leak visual check", frequency: "Weekly", due: daysFrom(-2), status: "Due", result: "" },
    { id: "IN-503", assetId: "M-101", title: "Thermal camera scan", frequency: "Monthly", due: daysFrom(12), status: "Due", result: "" },
    { id: "IN-498", assetId: "G-118", title: "Gearbox breather check", frequency: "Monthly", due: daysFrom(-9), status: "Passed", result: "Breather clear" },
  ];

  return { assets, alerts, workOrders, inspections, activity: [{ id: "ev-0", at: new Date().toISOString(), text: "Sample workspace created" }] };
}

/** Deterministic sensor trend for an asset (sample). */
export function trend(asset, n = 48) {
  const r = rng(asset.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  const deg = asset.health == null ? 0 : (100 - asset.health) / 100;
  return Array.from({ length: n }, (_, i) => {
    const drift = deg * 3.2 * (i / n);
    return +(asset.vibration - deg * 3 + drift + Math.sin(i / 5) * 0.35 + (r() - 0.5) * 0.7).toFixed(2);
  });
}

export const DOWNTIME = [
  { cause: "Bearing failure", hours: 41 }, { cause: "Seal leakage", hours: 28 }, { cause: "Motor overheating", hours: 19 },
  { cause: "Belt / coupling", hours: 13 }, { cause: "Electrical", hours: 8 },
];
