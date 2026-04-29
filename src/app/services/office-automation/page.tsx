import type { Metadata } from "next";
import OfficeAutomation from "../../pages/services/OfficeAutomation";

export const metadata: Metadata = {
  title: "Office Automation",
  description:
    "Streamline office operations with intelligent workflow automation. Reduce manual work, eliminate errors and boost productivity.",
};

export default function Page() {
  return <OfficeAutomation />;
}
