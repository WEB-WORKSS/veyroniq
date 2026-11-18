/**
 * Canonical business record for Veyroniq — the single source of truth.
 *
 * The website, SEO metadata, team section, LinkedIn kit, AWS architecture, AWS Activate answers
 * and docs all read from this file. Change facts here, not on individual pages.
 *
 * Every fact carries a `status`:
 *   "verified"  – published by the founder on the existing live site (veyroniq.site)
 *   "assumed"   – a reasonable default; confirm before using it as fact (shown in /app)
 *   "missing"   – not known; never shown publicly, listed for the founder in /app
 */

export const business = {
  name: "Veyroniq",
  domain: "veyroniq.site",
  url: "https://www.veyroniq.site",
  email: "fawaz@veyroniq.site",
  copyrightYear: 2026,

  oneLiner: "Predictive maintenance software for industrial equipment.",
  positioning:
    "Veyroniq is predictive maintenance software for manufacturers and industrial operators. It reads vibration, temperature, pressure and maintenance history to flag abnormal machine behaviour, estimate when a failure is likely and tell maintenance teams what to fix first, so repairs fit planned stops instead of interrupting production.",
  problem:
    "Most maintenance is still run-to-failure or calendar-based. One causes unplanned stops, expedited parts and scrap; the other replaces healthy parts and still misses failures that develop between inspections.",
  howItWorks:
    "Sensor readings and maintenance records are streamed in, baseline models learn each asset's normal behaviour, new data is scored for anomalies and failure windows, and maintenance teams receive ranked, plain-language recommendations.",

  category: "Industrial AI · Predictive maintenance SaaS",
  businessModel: "B2B SaaS",
  companyType: "Privately Held",

  // ---- Product stage (Part D) ----
  stage: {
    value: "Ideating/building initial product",
    label: "Building initial product",
    status: "verified",
    evidence:
      "The live site states Veyroniq is in initial product development and the demo is a prototype using sample data. No customers, deployed pipeline or trained models exist yet.",
  },

  // ---- Facts with verification status ----
  facts: {
    foundingYear: { value: "2026", status: "verified", note: "Stated on the live site. Confirm against incorporation documents." },
    headquarters: { value: null, status: "missing", note: "City and country are needed for LinkedIn and AWS Activate (team country)." },
    country: { value: null, status: "missing", note: "Needed for AWS Activate 'team size and country'." },
    teamSize: { value: "1", status: "assumed", note: "Only the founder is listed publicly. Update if others work on Veyroniq." },
    linkedinCompanyUrl: { value: null, status: "missing", note: "No LinkedIn company page exists yet. Suggested slug in the LinkedIn kit is unconfirmed." },
    founderLinkedin: { value: null, status: "missing", note: "Add the founder's personal LinkedIn URL to show it on the Team section." },
    launchDate: { value: "March 15, 2027", status: "assumed", note: "Proposed early-access launch date (4 months out). Confirm before submitting to AWS." },
    funding: { value: "No Funding", status: "assumed", note: "No investors are mentioned anywhere. Confirm no external funding has been raised." },
    valuation: { value: "No Valuation", status: "assumed", note: "No priced round assumed." },
    awsSpendShare: { value: "75 - 99%", status: "assumed", note: "Planned infrastructure is AWS-centric; the marketing site is hosted on Vercel. Re-estimate once infrastructure runs." },
    marketingBudget: { value: "< $250,000", status: "assumed", note: "Bootstrapped, pre-launch company. Confirm the planned annual marketing budget." },
    traction: { value: null, status: "missing", note: "No pilots, users or revenue are claimed. Add verified milestones when they exist." },
    pricing: { value: "indicative", status: "assumed", note: "Website pricing is indicative launch pricing, not a confirmed offer. Confirm before taking payment." },
    awsAccount: { value: "AWS account exists", status: "verified", note: "An AWS account is in use for development. No production workloads run on it yet." },
  },

  founders: [
    {
      name: "Fawaz Adekilekun",
      initials: "FA",
      title: "Founder",
      email: "fawaz@veyroniq.site",
      linkedin: null, // add verified URL to display it
      photo: null, // e.g. "/assets/team/fawaz.jpg"
      bio: "Fawaz founded Veyroniq in 2026 to give maintenance and reliability teams earlier, clearer warning of equipment failure, and leads product development and the early-access programme.",
      bioStatus: "assumed",
    },
  ],

  customers: {
    primary: "Businesses",
    segments: [
      "Manufacturing plants",
      "Industrial production facilities",
      "Food processing",
      "Mining operations",
      "Oil & gas sites",
      "Factory maintenance departments",
      "Industrial engineering companies",
      "Industrial equipment operators",
    ],
  },

  channels: ["Web browser"],

  goals: [
    "Build the telemetry ingestion and storage pipeline on AWS",
    "Train first anomaly-detection models on early-access plant data",
    "Run working sessions with early-access maintenance teams",
    "Release failure forecasting and recommendations to early-access customers",
    "Set pricing with early-access customers",
  ],

  // Feature classification (Part D2). Public copy must match these.
  features: [
    { name: "Real-time machine health monitoring", status: "prototype" },
    { name: "AI-powered anomaly detection", status: "planned" },
    { name: "Failure-window forecasting", status: "planned" },
    { name: "Intelligent maintenance recommendations", status: "planned" },
    { name: "Downtime & performance analytics", status: "prototype" },
    { name: "Asset, work-order and inspection management", status: "prototype" },
    { name: "Sample workspace (browser)", status: "implemented" },
    { name: "Cognito sign-in / sign-up integration", status: "implemented-untested" },
  ],
};

/** AWS architecture — every service is classified (Part D3). */
export const aws = {
  intro:
    "Veyroniq is being designed as an event-driven platform on AWS. Plant gateways would stream telemetry into AWS IoT Core, readings would be stored in Amazon Timestream and Amazon S3, AWS Lambda would score new data, and models on Amazon SageMaker and Amazon Bedrock would turn it into failure forecasts and plain-language recommendations. These services make up the proposed production architecture; none is described as running in production yet.",
  stages: [
    { key: "collect", title: "Data collection", services: ["AWS IoT Core"], text: "Plant gateways publish vibration, temperature and pressure readings over MQTT." },
    { key: "store", title: "Secure storage", services: ["Amazon Timestream", "Amazon S3"], text: "Recent readings for fast queries; full history and training sets for models." },
    { key: "process", title: "Processing", services: ["AWS Lambda"], text: "Validates readings, routes events and triggers scoring and alert workflows." },
    { key: "ai", title: "AI intelligence", services: ["Amazon SageMaker", "Amazon Bedrock"], text: "Anomaly detection, failure-window forecasts and recommendation text." },
    { key: "app", title: "Application experience", services: ["Amazon API Gateway", "Amazon DynamoDB", "Amazon Cognito"], text: "Workspace API, asset and work-order records, and user sign-in." },
  ],
  services: [
    { name: "AWS IoT Core", purpose: "Connects plant gateways and ingests machine telemetry.", status: "proposed" },
    { name: "Amazon Timestream", purpose: "Stores time-series sensor readings for trend queries and health scoring.", status: "proposed" },
    { name: "Amazon S3", purpose: "Stores raw sensor history and datasets for model training.", status: "proposed" },
    { name: "AWS Lambda", purpose: "Processes incoming readings and triggers scoring and alert workflows.", status: "proposed" },
    { name: "Amazon SageMaker", purpose: "Trains and hosts anomaly-detection and failure-forecasting models.", status: "proposed" },
    { name: "Amazon Bedrock", purpose: "Generates maintenance recommendations and summarises asset history.", status: "proposed" },
    { name: "Amazon DynamoDB", purpose: "Holds assets, health scores, alerts, work orders and recommendations.", status: "proposed" },
    { name: "Amazon API Gateway", purpose: "Provides the authenticated workspace API used by the web app.", status: "proposed" },
    { name: "Amazon Cognito", purpose: "Manages user sign-up, sign-in and password recovery.", status: "in-progress", note: "Client integration is written in this codebase; no user pool is configured yet." },
  ],
  stack: ["React 18", "Vite", "Tailwind CSS", "React Router", "amazon-cognito-identity-js", "Vercel (website hosting)"],
};

export const contact = {
  email: business.email,
  leadEndpoint: import.meta.env?.VITE_LEAD_ENDPOINT || "",
};

/** Facts that still need the founder's confirmation, for /app. */
export function openItems() {
  return Object.entries(business.facts)
    .filter(([, f]) => f.status !== "verified")
    .map(([key, f]) => ({ key, ...f }));
}
