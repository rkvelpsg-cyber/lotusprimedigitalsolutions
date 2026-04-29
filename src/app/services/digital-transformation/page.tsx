import type { Metadata } from "next";
import DigitalTransformation from "../../pages/services/DigitalTransformation";

export const metadata: Metadata = {
  title: "Digital Transformation",
  description:
    "End-to-end digital transformation services. From strategy to implementation, we guide you through every step of your digital journey.",
};

export default function Page() {
  return <DigitalTransformation />;
}
