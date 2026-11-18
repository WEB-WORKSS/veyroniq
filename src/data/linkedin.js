import { business } from "./business.js";

const founder = business.founders[0];

export const linkedin = {
  name: business.name,
  website: business.url,
  industry: "Software Development",
  companyType: business.companyType,
  companySize: "0-1 employees",
  companySizeNote: "Only the founder is listed. LinkedIn's brackets are 0-1, 2-10, 11-50… Choose 2-10 only if at least two people work on Veyroniq.",
  founded: business.facts.foundingYear.value,
  headquarters: business.facts.headquarters.value || "To confirm",
  slug: "veyroniq",
  slugAlternatives: ["veyroniq-ai", "veyroniq-maintenance", "veyroniqhq"],
  slugStatus:
    "Unconfirmed. linkedin.com/company/veyroniq could not be checked automatically (LinkedIn blocks automated requests). Enter it during page creation; if LinkedIn says it's taken, try the alternatives in order.",
  tagline: "Predictive maintenance software that tells industrial teams which machine will fail, when, and what to fix first.",
  overview: `Veyroniq builds predictive maintenance software for manufacturers and industrial operators.

Unplanned equipment failures stop production lines, force expedited parts and overtime, and cause scrap and missed orders. Calendar-based servicing helps, but it replaces parts that still had life left and still misses failures that develop between inspections.

Veyroniq reads vibration, temperature, pressure and maintenance history together. Models learn each machine's normal behaviour, flag readings that drift away from it, estimate a likely failure window for degrading components and turn each alert into a plain-language recommendation: the likely fault, what to check and the parts usually needed.

Core capabilities:
• Real-time machine health scores by line, area and site
• Anomaly detection across multiple signals, not single fixed thresholds
• Failure-window forecasts so work fits planned stops
• Ranked maintenance recommendations based on each asset's history
• Downtime and reliability analytics by asset, line and cause

Veyroniq supports maintenance teams; it never controls equipment. People make the call.

We're currently building the initial product on a proposed AWS architecture and working with maintenance and reliability teams who want early access. Explore the interactive sample workspace at veyroniq.site.`,
  specialties: [
    "Predictive Maintenance", "Condition Monitoring", "Machine Health Monitoring", "Anomaly Detection", "Failure Forecasting",
    "Vibration Analysis", "Industrial AI", "Machine Learning", "Industrial IoT", "Asset Performance Management",
    "Reliability Engineering", "Maintenance Planning", "Downtime Reduction", "Root Cause Analysis", "Manufacturing Analytics",
    "Rotating Equipment", "Work Order Prioritisation", "Mining Equipment Maintenance", "Oil and Gas Equipment", "Food Processing Equipment",
  ],
  founder: { name: founder.name, title: `${founder.title}, ${business.name}`, email: founder.email, linkedin: founder.linkedin || "To add" },
  banner: {
    file: "/assets/linkedin-banner.png",
    size: "1584 × 396",
    notes: "Logo and copy sit right of centre so the profile photo overlay (bottom-left on desktop) never covers them. Content is kept inside the central safe zone for mobile crops.",
  },
};
