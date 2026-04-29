import type { Metadata } from "next";
import DigitalMarketing from "../../pages/services/DigitalMarketing";

export const metadata: Metadata = {
  title: "Digital Marketing",
  description:
    "Data-driven digital marketing strategies — SEO, PPC, content marketing and analytics that deliver measurable ROI.",
};

export default function Page() {
  return <DigitalMarketing />;
}
