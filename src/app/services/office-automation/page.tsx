import type { Metadata } from "next";
import OfficeAutomation from "../../pages/services/OfficeAutomation";

export const metadata: Metadata = {
  title: "Office Automation | Workflow & Process Automation — Bangalore, India",
  description:
    "Office automation and intelligent workflow solutions for businesses in Bangalore and India. Automate invoicing, HR processes, document management, and approval workflows using Microsoft Power Automate, RPA, and custom solutions. Reduce manual work by 70%.",
  keywords: [
    "office automation Bangalore",
    "workflow automation India",
    "RPA solutions Bangalore",
    "Microsoft Power Automate India",
    "business process automation",
    "document management automation",
    "HR automation India",
    "invoice processing automation",
    "process digitization Bangalore",
    "UiPath RPA India",
  ],
  openGraph: {
    title: "Office Automation | Lotus Prime Digital Solutions",
    description:
      "Intelligent office automation and workflow solutions for businesses in Bangalore. Automate repetitive tasks, reduce errors, and boost productivity.",
    url: "https://www.lotusprimedigitalsolutions.com/services/office-automation",
  },
};

export default function Page() {
  return <OfficeAutomation />;
}
