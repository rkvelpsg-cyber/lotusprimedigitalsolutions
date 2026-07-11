import type { Metadata } from "next";
import SocialMediaManagement from "../../pages/services/SocialMediaManagement";

export const metadata: Metadata = {
  title:
    "Social Media Management | Instagram, Facebook & LinkedIn — Bangalore, India",
  description:
    "Professional social media management services in Bangalore. We handle content creation, posting, community management, and paid social advertising on Instagram, Facebook, LinkedIn, YouTube, and Twitter for businesses across India.",
  keywords: [
    "social media management Bangalore",
    "Instagram marketing India",
    "Facebook marketing Bangalore",
    "LinkedIn marketing India",
    "social media agency Bangalore",
    "content creation social media",
    "social media advertising India",
    "brand building social media",
    "community management Bangalore",
    "YouTube marketing India",
  ],
  openGraph: {
    title: "Social Media Management | Lotus Prime Digital Solutions",
    description:
      "Expert social media management in Bangalore for Instagram, Facebook, LinkedIn, and YouTube. Build your brand and grow your audience across India.",
    url: "https://www.lotusprimedigitalsolutions.com/services/social-media-management",
  },
};

export default function Page() {
  return <SocialMediaManagement />;
}
