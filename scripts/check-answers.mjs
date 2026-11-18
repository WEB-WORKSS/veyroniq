// Validates the AWS Activate answers and LinkedIn copy against their limits. Run: npm run check
import { generateAnswers } from "../src/data/aws-answers.js";
import { linkedin } from "../src/data/linkedin.js";
let bad = 0;
for (const a of generateAnswers()) {
  const v = Array.isArray(a.answer) ? `${a.answer.length} selections` : a.answer;
  console.log(`Q${a.n}: ${a.chars ? a.chars + " chars" : v} [${a.status}]${a.issues.length ? "  ✗ " + a.issues.join("; ") : "  ✓"}`);
  bad += a.issues.length;
}
const t = linkedin.tagline.length, o = linkedin.overview.length, s = linkedin.specialties.length;
console.log(`LinkedIn tagline ${t}/120 ${t <= 120 ? "✓" : "✗"} · overview ${o}/2000 ${o <= 2000 ? "✓" : "✗"} · specialties ${s}/20 ${s <= 20 ? "✓" : "✗"}`);
if (t > 120 || o > 2000 || s > 20) bad++;
process.exit(bad ? 1 : 0);
