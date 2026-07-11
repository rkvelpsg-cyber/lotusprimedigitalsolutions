import type { Metadata } from "next";
import DigitalMarketing from "../../pages/services/DigitalMarketing";

export const metadata: Metadata = {
  title:
    "Digital Marketing | SEO, PPC & Social Media Advertising — Bangalore, India",
  description:
    "Full-service digital marketing agency in Bangalore. We provide SEO, Google Ads, PPC, social media marketing, email marketing, and content marketing services that drive organic traffic and generate quality leads across India.",
  keywords: [
    "digital marketing Bangalore",
    "SEO services India",
    "Google Ads management Bangalore",
    "PPC advertising India",
    "social media marketing Bangalore",
    "content marketing India",
    "email marketing services",
    "online marketing agency Bangalore",
    "lead generation India",
    "digital marketing agency Whitefield",
  ],
  openGraph: {
    title: "Digital Marketing | Lotus Prime Digital Solutions",
    description:
      "Full-service digital marketing in Bangalore: SEO, PPC, social media, email marketing, and content strategy to grow your online presence across India.",
    url: "https://www.lotusprimedigitalsolutions.com/services/digital-marketing",
  },
};

export default function Page() {
  return <DigitalMarketing />;
}
