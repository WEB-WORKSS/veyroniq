// Renders PNG brand assets from SVG source: npm run assets
import sharp from "sharp";
import fs from "node:fs";

const FONT = "Helvetica Neue, Arial, sans-serif";
const mark = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect width="32" height="32" rx="7" fill="#0F1D36"/><path d="M7 9l9 15 9-15" fill="none" stroke="#2F6BFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 13.5h3l1.6-3 2 6 1.4-3H21" fill="none" stroke="#22D3EE" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>`;

function wave(x0, y0, w, h, n = 70, seed = 7) {
  let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pts = Array.from({ length: n }, (_, i) => 0.45 + 0.12 * Math.sin(i / 7) + (r() - 0.5) * 0.18 + (i > n * 0.7 ? (i - n * 0.7) / n * 0.9 : 0));
  return pts.map((v, i) => `${i ? "L" : "M"}${(x0 + (i / (n - 1)) * w).toFixed(1)} ${(y0 + h - v * h).toFixed(1)}`).join(" ");
}

const grid = (w, h) => { let g = ""; for (let x = 0; x <= w; x += 44) g += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#1C2D4D" stroke-opacity=".5"/>`; for (let y = 0; y <= h; y += 44) g += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#1C2D4D" stroke-opacity=".5"/>`; return g; };

function card(x, y) {
  const d = wave(x + 22, y + 70, 356, 96);
  return `<g><rect x="${x}" y="${y}" width="400" height="236" rx="16" fill="#F6F8FB" stroke="#CDD5E1"/>
  <text x="${x + 22}" y="${y + 34}" font-family="${FONT}" font-size="14" fill="#4A5568">P-204 Transfer pump · vibration</text>
  <circle cx="${x + 368}" cy="${y + 30}" r="5" fill="#0F8A5F"/>
  <line x1="${x + 22}" x2="${x + 378}" y1="${y + 92}" y2="${y + 92}" stroke="#A16207" stroke-dasharray="5 6" stroke-opacity=".7"/>
  <path d="${d}" fill="none" stroke="#1F5BF0" stroke-width="3"/>
  <rect x="${x + 22}" y="${y + 180}" width="356" height="38" rx="9" fill="#FEF6E7" stroke="#E7C27A"/>
  <text x="${x + 36}" y="${y + 204}" font-family="${FONT}" font-size="14" font-weight="700" fill="#8A5205">Bearing wear · likely in 18–26 days</text></g>`;
}

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
<rect width="1584" height="396" fill="#FFFFFF"/><rect y="394" width="1584" height="2" fill="#1F5BF0"/>
${mark(440, 92, 1.6)}<text x="506" y="128" font-family="${FONT}" font-weight="800" font-size="30" letter-spacing="7" fill="#0B1324">VEYRONIQ</text>
<text x="440" y="200" font-family="${FONT}" font-weight="800" font-size="40" fill="#0B1324">Know which machine will fail —</text>
<text x="440" y="248" font-family="${FONT}" font-weight="800" font-size="40" fill="#1F5BF0">before it stops your line.</text>
<text x="440" y="296" font-family="${FONT}" font-size="20" fill="#4A5568">Predictive maintenance for industrial equipment · veyroniq.site</text>
${card(1140, 80)}</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#FFFFFF"/><rect y="624" width="1200" height="6" fill="#1F5BF0"/>
${mark(72, 72, 1.7)}<text x="140" y="111" font-family="${FONT}" font-weight="800" font-size="30" letter-spacing="7" fill="#0B1324">VEYRONIQ</text>
<text x="72" y="250" font-family="${FONT}" font-weight="800" font-size="58" fill="#0B1324">Know which machine</text>
<text x="72" y="320" font-family="${FONT}" font-weight="800" font-size="58" fill="#0B1324">will fail — <tspan fill="#1F5BF0">before it</tspan></text>
<text x="72" y="390" font-family="${FONT}" font-weight="800" font-size="58" fill="#1F5BF0">stops your line.</text>
<text x="72" y="470" font-family="${FONT}" font-size="24" fill="#4A5568">Predictive maintenance for industrial equipment</text>
${card(740, 330)}</svg>`;

const logoT = `<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="240" viewBox="0 0 220 40">${mark(0, 4, 1)}<text x="44" y="27.5" font-family="${FONT}" font-weight="800" font-size="19" letter-spacing="3.2" fill="#0B1324">VEYRONIQ</text></svg>`;

await sharp(Buffer.from(banner)).png().toFile("public/assets/linkedin-banner.png");
await sharp(Buffer.from(og)).png().toFile("public/assets/og-image.png");
await sharp(Buffer.from(logoT)).png().toFile("public/assets/logo-transparent.png");
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 32 32">${mark(0, 0, 1)}</svg>`)).png().toFile("public/assets/logo-mark-400.png");
for (const f of fs.readdirSync("public/assets")) console.log(f, fs.statSync(`public/assets/${f}`).size);
