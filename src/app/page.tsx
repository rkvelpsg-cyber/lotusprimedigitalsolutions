import type { Metadata } from "next";
import Home from "./pages/Home";

export const metadata: Metadata = {
  title:
    "Lotus Prime Digital Solutions | Digital & AI Solutions Company — Bangalore, India",
  description:
    "Lotus Prime Digital Solutions — Bangalore's trusted digital transformation partner. We deliver Website Development, AI Solutions, Mobile Apps, Cloud, CRM, Digital Marketing, E-Commerce, Office Automation, and Social Media Management for businesses across India.",
  keywords: [
    "digital solutions company Bangalore",
    "AI solutions Bangalore India",
    "website development company Bangalore",
    "mobile app development Bangalore",
    "digital marketing agency Bangalore",
    "cloud solutions India",
    "CRM solutions India",
    "e-commerce development Bangalore",
    "office automation India",
    "digital transformation company India",
    "IT company Whitefield Bangalore",
    "software company Karnataka",
  ],
  openGraph: {
    title: "Lotus Prime Digital Solutions | Digital & AI Solutions — Bangalore",
    description:
      "Bangalore's trusted digital transformation partner offering Website Development, AI Solutions, Mobile Apps, Cloud, CRM, and Digital Marketing for businesses across India.",
    url: "https://www.lotusprimedigitalsolutions.com",
  },
};

export default function Page() {
  return <Home />;
}
