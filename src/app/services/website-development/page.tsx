import type { Metadata } from "next";
import WebsiteDevelopment from "../../pages/services/WebsiteDevelopment";

export const metadata: Metadata = {
  title:
    "Website Development | Custom Web Design & Development — Bangalore, India",
  description:
    "Professional website development services in Bangalore. We build custom, responsive, SEO-optimized websites using React, Next.js, and WordPress. Serving businesses across India with fast, secure, and conversion-focused web solutions.",
  keywords: [
    "website development Bangalore",
    "web design company India",
    "custom website development",
    "responsive web design Bangalore",
    "React Next.js development India",
    "WordPress development Bangalore",
    "SEO-friendly website India",
    "corporate website development",
    "landing page development",
    "web development company Whitefield",
  ],
  openGraph: {
    title: "Website Development | Lotus Prime Digital Solutions",
    description:
      "Custom, responsive, and SEO-optimized websites built with React, Next.js, and WordPress for businesses in Bangalore and across India.",
    url: "https://www.lotusprimedigitalsolutions.com/services/website-development",
  },
};

export default function Page() {
  return <WebsiteDevelopment />;
}
