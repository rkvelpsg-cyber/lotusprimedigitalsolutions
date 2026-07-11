import type { Metadata } from "next";
import DigitalTransformation from "../../pages/services/DigitalTransformation";

export const metadata: Metadata = {
  title:
    "Digital Transformation | End-to-End IT Modernization — Bangalore, India",
  description:
    "End-to-end digital transformation services for enterprises and SMBs in Bangalore and India. We modernize legacy systems, implement AI and cloud, digitize business processes, and build data-driven organizations. Start your transformation journey today.",
  keywords: [
    "digital transformation Bangalore",
    "IT modernization India",
    "enterprise digital transformation",
    "legacy system modernization",
    "business process digitization India",
    "ERP implementation Bangalore",
    "digital strategy consulting India",
    "technology transformation SMB",
    "data-driven organization India",
    "digital transformation company Bangalore",
  ],
  openGraph: {
    title: "Digital Transformation | Lotus Prime Digital Solutions",
    description:
      "Comprehensive digital transformation for businesses in Bangalore and India. Strategy, technology, and change management to modernize your entire organization.",
    url: "https://www.lotusprimedigitalsolutions.com/services/digital-transformation",
  },
};

export default function Page() {
  return <DigitalTransformation />;
}
