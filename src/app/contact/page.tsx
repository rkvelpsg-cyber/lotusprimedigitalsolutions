import type { Metadata } from "next";
import Contact from "../pages/Contact";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Consultation",
  description:
    "Contact Lotus Prime Digital Solutions in Bangalore. Request a free consultation, get a project quote, or discuss your website, AI, mobile app, CRM, cloud, or digital marketing needs with our experts.",
  keywords: [
    "contact Lotus Prime Digital Solutions",
    "digital solutions Bangalore",
    "website development consultation",
    "AI solutions inquiry",
    "CRM solutions Bangalore",
    "mobile app development quote",
    "digital marketing agency Bangalore",
    "cloud solutions India",
    "IT company Whitefield Bangalore",
    "free digital consultation India",
  ],
  openGraph: {
    title: "Contact Lotus Prime Digital Solutions | Free Consultation",
    description:
      "Get in touch with our team for a free consultation on website development, AI solutions, mobile apps, CRM, cloud, and digital marketing services.",
    url: "https://www.lotusprimedigitalsolutions.com/contact",
  },
};

export default function Page() {
  return <Contact />;
}
