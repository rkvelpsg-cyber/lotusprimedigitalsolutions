import type { Metadata } from "next";
import MobileAppDevelopment from "../../pages/services/MobileAppDevelopment";

export const metadata: Metadata = {
  title: "Mobile App Development",
  description:
    "Native and cross-platform iOS & Android mobile application development. Reach your customers wherever they are.",
};

export default function Page() {
  return <MobileAppDevelopment />;
}
