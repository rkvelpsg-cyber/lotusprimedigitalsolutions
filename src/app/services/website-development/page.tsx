import type { Metadata } from "next";
import WebsiteDevelopment from "../../pages/services/WebsiteDevelopment";

export const metadata: Metadata = {
  title: "Website Development",
  description:
    "Custom, responsive website development services. Modern technologies, SEO optimized, and built to scale with your business.",
};

export default function Page() {
  return <WebsiteDevelopment />;
}
