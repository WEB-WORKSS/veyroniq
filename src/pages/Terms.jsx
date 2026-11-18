import { LegalPage, UPDATED } from "./Legal.jsx";
import { business } from "../data/business.js";

// Review note: governing law, company legal entity and liability caps need legal review before paid plans launch.
export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updated={UPDATED}
      intro={`These terms apply when you use ${business.domain}, the sample workspace and, once available, the ${business.name} application. By using them you agree to these terms. ${business.name} is building its initial product; separate commercial terms will be agreed with customers before any paid service begins.`}
      sections={[
        ["Access and use", [
          "You may use the website and sample workspace for evaluating Veyroniq. When accounts open, you are responsible for keeping your login details secure and for activity under your account.",
        ]],
        ["The sample workspace", [
          "The sample workspace uses fictional data. Health scores, forecasts and recommendations shown there are illustrative and must not be used to make decisions about real equipment.",
        ]],
        ["Customer responsibilities", [[
          "Provide accurate account and contact information",
          "Only upload data you have the right to share",
          "Keep your credentials confidential and tell us about any unauthorised use",
        ]]],
        ["Acceptable use", [[
          "Do not attempt to break, probe or overload the service or bypass security",
          "Do not use the service to violate laws or others' rights",
          "Do not copy, resell or reverse engineer the service",
        ]]],
        ["Maintenance decisions", [
          "Veyroniq provides monitoring, forecasts and recommendations to support maintenance teams. It does not control equipment. You remain responsible for maintenance, safety and operating decisions, and for following applicable safety procedures and regulations.",
        ]],
        ["Intellectual property", [
          `${business.name} owns the website, software and branding. You keep ownership of the data you provide. You grant us permission to process it only to provide and improve the service for you.`,
        ]],
        ["Disclaimers", [
          `The website and sample workspace are provided "as is" without warranties of any kind. Forecasts are estimates and may be wrong. Features described as planned or proposed may change or may not be released.`,
        ]],
        ["Limitation of liability", [
          `To the extent permitted by law, ${business.name} is not liable for indirect, incidental or consequential losses, including lost production or profits, arising from use of the website or sample workspace.`,
        ]],
        ["Changes and termination", ["We may update these terms and will change the date above when we do. We may suspend access that breaks these terms."]],
      ]}
    />
  );
}
