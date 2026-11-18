// Regenerates docs/*.md from the canonical business record: npm run docs
import fs from "node:fs";
import { business, aws, openItems } from "../src/data/business.js";
import { linkedin } from "../src/data/linkedin.js";
import { generateAnswers, businessDetails } from "../src/data/aws-answers.js";

const w = (f, s) => { fs.writeFileSync(`docs/${f}`, s.trim() + "\n"); console.log("wrote docs/" + f); };
const note = "> Generated from `src/data/business.js` by `npm run docs`. Edit the business record, not this file.\n";

w("aws-activate-answers.md", `# ${business.name} — AWS Activate Portfolio answers\n\n${note}
Status key: **verified** = taken from published facts · **assumed** = confirm before submitting · **missing** = needs input.

${generateAnswers().map((a) => `## Q${a.n} — ${a.q}

**Selected answer:**
${Array.isArray(a.answer) ? a.answer.map((x) => `- ${x}`).join("\n") : `\n${a.answer}`}
${a.chars ? `\n**Character count:** ${a.chars} / 250\n` : ""}
**Reason:** ${a.reason}

**Verification status:** ${a.status}${a.note ? ` — ${a.note}` : ""}${a.issues.length ? `\n\n**Validation issues:** ${a.issues.join("; ")}` : ""}
`).join("\n")}
## Business details (derived)

| Field | Value |
|---|---|
${businessDetails().map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Facts to confirm

${openItems().map((o) => `- **${o.key}** (${o.status})${o.value ? ` — ${o.value}` : ""}: ${o.note}`).join("\n")}
`);

w("linkedin-profile.md", `# ${business.name} — LinkedIn company profile kit\n\n${note}
| Field | Value |
|---|---|
| Company name | ${linkedin.name} |
| Website | ${linkedin.website} |
| Industry | ${linkedin.industry} |
| Company type | ${linkedin.companyType} |
| Company size | ${linkedin.companySize} — ${linkedin.companySizeNote} |
| Founded | ${linkedin.founded} |
| Headquarters | ${linkedin.headquarters} |
| Suggested public URL | linkedin.com/company/${linkedin.slug} (unconfirmed) |

**URL check:** ${linkedin.slugStatus} Alternatives: ${linkedin.slugAlternatives.join(", ")}.

## Tagline (${linkedin.tagline.length}/120)

${linkedin.tagline}

## Overview (${linkedin.overview.length}/2,000)

${linkedin.overview}

## Specialties (${linkedin.specialties.length}/20)

${linkedin.specialties.join(", ")}

## Founder

${linkedin.founder.name} — ${linkedin.founder.title} · ${linkedin.founder.email} · LinkedIn: ${linkedin.founder.linkedin}
`);

w("aws-architecture.md", `# ${business.name} — AWS architecture\n\n${note}
${aws.intro}

## Five-stage pipeline

${aws.stages.map((s, i) => `${i + 1}. **${s.title}** — ${s.services.join(", ")}: ${s.text}`).join("\n")}

## Services

| Service | Purpose | Status |
|---|---|---|
${aws.services.map((s) => `| ${s.name} | ${s.purpose}${s.note ? ` ${s.note}` : ""} | ${s.status} |`).join("\n")}

Nothing above is deployed to production. Only describe a service as "running" or say "Built on AWS" once it is deployed and in use.

## Application stack

${aws.stack.join(", ")}
`);
