import type { Metadata } from "next";
import CRMSolutions from "../../pages/services/CRMSolutions";

export const metadata: Metadata = {
  title: "CRM Solutions | Salesforce, HubSpot, Zoho CRM — Bangalore, India",
  description:
    "Professional CRM implementation and customization in Bangalore. We configure Salesforce, HubSpot, Zoho CRM, and Microsoft Dynamics for your business. Increase sales, improve customer service, and grow revenue with the right CRM.",
  keywords: [
    "CRM solutions Bangalore",
    "CRM implementation India",
    "Salesforce partner India",
    "HubSpot CRM Bangalore",
    "Zoho CRM setup",
    "Microsoft Dynamics 365 India",
    "customer relationship management software",
    "sales automation Bangalore",
    "CRM customization India",
    "CRM integration services",
    "lead management software India",
  ],
  openGraph: {
    title: "CRM Solutions | Lotus Prime Digital Solutions",
    description:
      "Expert CRM implementation for Salesforce, HubSpot, Zoho, and custom CRM platforms. Boost sales, improve customer service, and grow your business.",
    url: "https://www.lotusprimedigitalsolutions.com/services/crm-solutions",
  },
};

export default function Page() {
  return <CRMSolutions />;
}
