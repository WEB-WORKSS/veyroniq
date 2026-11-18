/**
 * AWS Activate answer engine (Part Q).
 * Reads the canonical business record, derives Q1–Q14, validates every selection against the
 * exact option lists, counts characters for Q9, and flags assumptions and missing facts.
 */
import { business, aws } from "./business.js";
import * as O from "./aws-options.js";

const f = business.facts;

function statusOf(...keys) {
  const s = keys.map((k) => f[k]?.status || "verified");
  if (s.includes("missing")) return "missing";
  if (s.includes("assumed")) return "assumed";
  return "verified";
}

export function buildQ9() {
  return `${business.name} is predictive maintenance software helping manufacturers and industrial operators prevent unplanned equipment failures. It uses machine learning on sensor and maintenance data, on a proposed AWS architecture, to forecast failures.`;
}

export function generateAnswers() {
  const stage = business.stage.value;
  const prelaunch = stage === "Ideating/building initial product";
  const usesIoT = aws.services.some((s) => s.name === "AWS IoT Core");

  const q9 = buildQ9();

  const answers = [
    {
      n: 1, q: "Top 3 ways AWS can help you", type: "multi", options: O.Q1_OPTIONS, rule: { exact: 3 },
      answer: prelaunch
        ? ["Launching products faster", "Building scalable architecture", "Reducing burn rate"]
        : ["Acquiring early customers", "Validating product concept", "Choosing right tech solutions"],
      reason: prelaunch
        ? "Veyroniq is pre-launch: the next milestones are building the telemetry pipeline and first models quickly, on an architecture that scales with connected assets, while keeping costs low as a bootstrapped company."
        : "Product is launched with few users.",
      status: "verified",
    },
    {
      n: 2, q: "AWS services to learn more about", type: "multi", options: O.Q2_OPTIONS, rule: { max: 20 },
      answer: [
        "AWS IoT Core", "Amazon Timestream", "Amazon S3", "AWS Lambda", "Amazon SageMaker", "Amazon Bedrock",
        "Amazon DynamoDB", "Amazon API Gateway", "Amazon Cognito", "Amazon Cloudwatch", "AWS Identity & Access", "AWS Budgets",
      ],
      reason: "Matches the proposed architecture on the website (ingest, store, process, AI, application) plus monitoring, access control and cost control that an early startup needs. Not padded to 20.",
      status: "verified",
    },
    {
      n: 3, q: "AWS tech topics to follow", type: "multi", options: O.Q3_OPTIONS, rule: { min: 3, max: 6 },
      answer: ["AI & machine learning", "Internet of things", "Serverless", "Big data/Analytics", "Security", "AWS cost management"],
      reason: "Core ML product fed by industrial sensors (IoT) on a serverless, data-heavy pipeline; security and cost management apply to every early startup.",
      status: "verified",
    },
    {
      n: 4, q: "What type of customers do you primarily serve?", type: "multi", options: O.Q4_OPTIONS, rule: { min: 1, max: 7 },
      answer: ["Manufacturing", "Industrial Internet of Things (IIoT)", "Artificial Intelligence (AI)", "Machine Learning (ML)", "Enterprise Software", "SaaS"],
      reason: "Customers are manufacturers and industrial operators; the product is ML-based SaaS working on IIoT sensor data. If the form allows only one selection, choose Manufacturing.",
      singleFallback: "Manufacturing",
      status: "verified",
    },
    {
      n: 5, q: "Primary target customers", type: "single", options: O.Q5_OPTIONS,
      answer: business.customers.primary,
      reason: "Plants, maintenance departments and industrial operators — all businesses.",
      status: "verified",
    },
    {
      n: 6, q: "Current product stage", type: "single", options: O.Q6_OPTIONS,
      answer: stage,
      reason: business.stage.evidence,
      status: business.stage.status,
    },
    {
      n: 7, q: "How customers interact with the product", type: "multi", options: O.Q7_OPTIONS, rule: { min: 1 },
      answer: business.channels,
      reason: "Veyroniq is a responsive web application. No mobile app or customer-facing API is being built yet, so neither is selected.",
      status: "verified",
    },
    {
      n: 8, q: "Does your product use AI/ML?", type: "single", options: O.Q8_OPTIONS,
      answer: O.Q8_OPTIONS[0],
      reason: "Anomaly detection and failure forecasting are the product itself, not an add-on.",
      status: "verified",
    },
    {
      n: 9, q: "What are you building?", type: "text", rule: { minChars: 30, maxChars: 250, target: [180, 240] },
      answer: q9,
      reason: "Plain-English: company, software type, customers, benefit and technology. States that the AWS architecture is proposed, not deployed.",
      status: "verified",
    },
    {
      n: 10, q: "Planned product launch date", type: "date",
      answer: f.launchDate.value,
      reason: "Proposed early-access launch about four months from now, after the core pipeline and first models are built.",
      status: f.launchDate.status, note: "Assumed — Confirm Before Submission",
    },
    {
      n: 11, q: "Most recent funding round", type: "single", options: O.Q11_OPTIONS,
      answer: f.funding.value,
      reason: "No external investors are recorded. Leave funding date fields blank.",
      status: statusOf("funding"), note: "Other round labels must be checked against the live AWS dropdown.",
    },
    {
      n: 12, q: "Latest valuation", type: "single", options: O.Q12_OPTIONS,
      answer: f.valuation.value,
      reason: "No priced round has been recorded.",
      status: statusOf("valuation"),
    },
    {
      n: 13, q: "Percentage of spend on AWS", type: "single", options: O.Q13_OPTIONS,
      answer: f.awsSpendShare.value,
      reason: usesIoT
        ? "All planned product infrastructure (IoT ingestion, storage, compute, ML, API, auth) is on AWS. Only the marketing site is hosted elsewhere (Vercel)."
        : "Mixed infrastructure.",
      status: statusOf("awsSpendShare"),
    },
    {
      n: 14, q: "Annual marketing spend", type: "single", options: O.Q14_OPTIONS,
      answer: f.marketingBudget.value,
      reason: "Bootstrapped, pre-launch company growing through direct early-access conversations.",
      status: statusOf("marketingBudget"),
    },
  ];

  return answers.map((a) => ({ ...a, issues: validate(a), chars: a.type === "text" ? a.answer.length : undefined }));
}

export function validate(a) {
  const issues = [];
  const list = Array.isArray(a.answer) ? a.answer : [a.answer];
  if (a.options) {
    for (const v of list) if (!a.options.includes(v)) issues.push(`"${v}" is not an exact option for Q${a.n}.`);
  }
  if (a.rule?.exact && list.length !== a.rule.exact) issues.push(`Q${a.n} needs exactly ${a.rule.exact} selections (has ${list.length}).`);
  if (a.rule?.max && list.length > a.rule.max) issues.push(`Q${a.n} allows at most ${a.rule.max} selections.`);
  if (a.rule?.min && list.length < a.rule.min) issues.push(`Q${a.n} needs at least ${a.rule.min} selections.`);
  if (a.type === "text") {
    const n = a.answer.length;
    if (n < a.rule.minChars || n > a.rule.maxChars) issues.push(`Q${a.n} must be ${a.rule.minChars}–${a.rule.maxChars} characters (has ${n}).`);
  }
  return issues;
}

export function answersAsText(answers = generateAnswers()) {
  const lines = [`${business.name} — AWS Activate Portfolio answers`, `${business.url}`, ""];
  for (const a of answers) {
    lines.push(`Q${a.n} — ${a.q}`);
    if (Array.isArray(a.answer)) a.answer.forEach((x) => lines.push(`  • ${x}`));
    else lines.push(`  ${a.answer}`);
    if (a.chars) lines.push(`  (${a.chars} characters)`);
    lines.push(`  Reason: ${a.reason}`);
    lines.push(`  Status: ${a.status}${a.note ? ` — ${a.note}` : ""}`);
    lines.push("");
  }
  return lines.join("\n");
}

/** Business details (Part O), derived from the record. */
export function businessDetails() {
  const unknown = (k) => (f[k]?.value ? f[k].value : "To confirm");
  return [
    ["Company name and website", `${business.name} — ${business.url}`],
    ["One-sentence description", business.oneLiner],
    ["Primary customers and industry", "Manufacturers and industrial operators (manufacturing, food processing, mining, oil & gas)"],
    ["Product stage", business.stage.value],
    ["Planned launch date", `${f.launchDate.value} (assumed)`],
    ["Customer interaction channels", business.channels.join(", ")],
    ["AI/ML usage", "Core product: anomaly detection, failure-window forecasting, recommendation generation"],
    ["Funding raised / latest round", `${f.funding.value} (assumed)`],
    ["Valuation", `${f.valuation.value} (assumed)`],
    ["Technology stack and AWS services", `${aws.stack.join(", ")}. Proposed AWS: ${aws.services.map((s) => s.name).join(", ")}`],
    ["Expected AWS spend share", `${f.awsSpendShare.value} (assumed)`],
    ["Planned annual marketing budget", `${f.marketingBudget.value} (assumed)`],
    ["Team size and country", `${unknown("teamSize")} · ${unknown("country")}`],
    ["Goals for the next 6–12 months", business.goals.join("; ")],
  ];
}
