import type { Metadata } from "next";
import CloudSolutions from "../../pages/services/CloudSolutions";

export const metadata: Metadata = {
  title: "Cloud Solutions",
  description:
    "Secure, scalable cloud solutions leveraging AWS, Azure and Google Cloud. Modernize your infrastructure for flexibility, reliability and cost savings.",
};

export default function Page() {
  return <CloudSolutions />;
}
