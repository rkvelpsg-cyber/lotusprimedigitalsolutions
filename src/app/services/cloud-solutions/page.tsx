import type { Metadata } from "next";
import CloudSolutions from "../../pages/services/CloudSolutions";

export const metadata: Metadata = {
  title:
    "Cloud Solutions | AWS, Azure & Google Cloud Services — Bangalore, India",
  description:
    "Expert cloud migration, infrastructure, and DevOps services in Bangalore. We implement AWS, Microsoft Azure, and Google Cloud solutions for businesses across India. Reduce IT costs, improve scalability, and achieve 99.9% uptime.",
  keywords: [
    "cloud solutions Bangalore",
    "AWS services India",
    "Microsoft Azure India",
    "Google Cloud Platform India",
    "cloud migration Bangalore",
    "DevOps services India",
    "cloud infrastructure management",
    "serverless architecture India",
    "cloud security services",
    "IT infrastructure Bangalore",
  ],
  openGraph: {
    title: "Cloud Solutions | Lotus Prime Digital Solutions",
    description:
      "AWS, Azure, and Google Cloud solutions for businesses in Bangalore and India. Expert cloud migration, DevOps, and managed cloud infrastructure services.",
    url: "https://www.lotusprimedigitalsolutions.com/services/cloud-solutions",
  },
};

export default function Page() {
  return <CloudSolutions />;
}
