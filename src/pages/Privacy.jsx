import { LegalPage, UPDATED } from "./Legal.jsx";
import { business } from "../data/business.js";

// Review note: jurisdiction, data-controller entity details and hosting regions are not yet confirmed.
// These are listed in /app → Business Information for legal review before launch.
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro={`This policy explains what personal information ${business.name} collects through ${business.domain} and the ${business.name} application, why we collect it, and the choices you have. ${business.name} is building its initial product, so this policy describes how the website and sample workspace work today and will be updated before customer accounts open.`}
      sections={[
        ["Information we collect", [
          "Information you send us: when you use the contact form or email us, we receive your name, business email, company, company size, primary use case and anything you write in your message.",
          "Account information: when accounts open, signing up will collect your name, work email and a password (handled by our authentication provider, Amazon Cognito; we never see or store your password), plus the workspace details you enter during onboarding.",
          "Sample workspace data: records you create in the sample workspace without an account are stored only in your own browser (local storage). They are not sent to us.",
          "Technical information: our hosting provider may log standard request data such as IP address, browser type and pages requested, for security and reliability.",
        ]],
        ["How we use information", [[
          "To reply to inquiries and early-access requests",
          "To create and secure your account and workspace, once accounts are available",
          "To operate, maintain and improve the website and product",
          "To meet legal obligations",
        ], "We do not sell personal information, and we do not use contact-form details for advertising."]],
        ["Where information is stored", [
          "The website is hosted by Vercel. Contact-form submissions are delivered by email, or to a form endpoint we configure. The planned product architecture stores customer data on Amazon Web Services; hosting regions will be confirmed with customers before any customer data is processed.",
        ]],
        ["Third-party services", [[
          "Vercel — website hosting",
          "Amazon Web Services (including Amazon Cognito) — authentication and planned product infrastructure",
          "Google Fonts — web fonts loaded from Google's servers",
          "Your email provider — when you choose to contact us by email",
        ]]],
        ["Retention", [
          "We keep inquiry emails for as long as needed to respond and follow up, and delete them on request. Account data will be kept while the account is active and deleted or anonymised after it is closed, unless the law requires longer retention.",
        ]],
        ["Your rights", [
          `You can ask us to access, correct, export or delete your personal information, or object to how we use it, by emailing ${business.email}. You can clear sample-workspace data at any time from the workspace settings or by clearing your browser's site data. Depending on where you live, you may also have the right to complain to a data protection authority.`,
        ]],
        ["Security", [
          "We use reputable providers and limit access to personal information to people who need it. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
        ]],
        ["Changes", ["We will update this page when our practices change, and change the date above."]],
      ]}
    />
  );
}
