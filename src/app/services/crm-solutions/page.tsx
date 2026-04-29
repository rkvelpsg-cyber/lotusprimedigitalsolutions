import type { Metadata } from "next";
import CRMSolutions from "../../pages/services/CRMSolutions";

export const metadata: Metadata = {
  title: "CRM Solutions",
  description:
    "Powerful CRM systems to manage customer relationships effectively. Increase sales, improve service and make data-driven business decisions.",
};

export default function Page() {
  return <CRMSolutions />;
}
