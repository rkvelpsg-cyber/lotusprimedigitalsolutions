import type { Metadata } from "next";
import AISolutions from "../../pages/services/AISolutions";

export const metadata: Metadata = {
  title: "AI Solutions | Machine Learning, NLP & Automation — Bangalore, India",
  description:
    "Expert AI solutions for businesses in Bangalore and India. Custom machine learning models, NLP, computer vision, predictive analytics, and intelligent process automation. Reduce costs by up to 60% with AI.",
  keywords: [
    "AI solutions Bangalore",
    "artificial intelligence India",
    "machine learning services",
    "NLP solutions",
    "computer vision India",
    "predictive analytics Bangalore",
    "process automation AI",
    "AI integration services",
    "business intelligence AI",
    "RPA solutions Bangalore",
    "AI company India",
    "chatbot development Bangalore",
  ],
  openGraph: {
    title: "AI Solutions | Lotus Prime Digital Solutions",
    description:
      "Custom AI and machine learning solutions for businesses in Bangalore and India. Automate processes, gain insights, and make smarter decisions.",
    url: "https://www.lotusprimedigitalsolutions.com/services/ai-solutions",
  },
};

export default function Page() {
  return <AISolutions />;
}
