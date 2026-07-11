import type { Metadata } from "next";
import About from "../pages/About";

export const metadata: Metadata = {
  title: "About Us | Lotus Prime Digital Solutions",
  description:
    "Learn about Lotus Prime Digital Solutions — a leading digital transformation company in Bangalore, India. Discover our mission, values, team, and our track record delivering AI, web, mobile, CRM, cloud, and digital marketing solutions.",
  keywords: [
    "about Lotus Prime Digital Solutions",
    "digital transformation company Bangalore",
    "IT services company India",
    "AI solutions company Bangalore",
    "website development company India",
    "digital agency Whitefield Bangalore",
    "software development company Bangalore",
  ],
  openGraph: {
    title: "About Lotus Prime Digital Solutions",
    description:
      "A leading digital transformation company in Bangalore delivering AI, web, mobile, cloud, CRM and digital marketing solutions for businesses across India.",
    url: "https://www.lotusprimedigitalsolutions.com/about",
  },
};

export default function Page() {
  return <About />;
}
