import type { Metadata } from "next";
import "@/styles/index.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ScrollToTop } from "./components/layout/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default:
      "Lotus Prime Digital Solutions | End-to-End Digital & AI Solutions",
    template: "%s | Lotus Prime Digital Solutions",
  },
  description:
    "Lotus Prime Digital Solutions — End-to-End Digital & AI Solutions for Modern Businesses. Website Development, AI, Mobile Apps, Cloud, CRM, Digital Marketing and more.",
  keywords: [
    "digital solutions",
    "AI solutions",
    "website development",
    "mobile app development",
    "cloud solutions",
    "digital marketing",
    "CRM solutions",
    "Bangalore",
    "India",
  ],
  authors: [{ name: "Lotus Prime Digital Solutions" }],
  creator: "Lotus Prime Digital Solutions",
  metadataBase: new URL("https://www.lotusprimedigital.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.lotusprimedigital.com",
    siteName: "Lotus Prime Digital Solutions",
    title: "Lotus Prime Digital Solutions | End-to-End Digital & AI Solutions",
    description:
      "End-to-End Digital & AI Solutions for Modern Businesses — Bangalore, India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotus Prime Digital Solutions",
    description: "End-to-End Digital & AI Solutions for Modern Businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "lv1wnbr1pv0WBP0RO2A7FKgiYv5uL577JU4BAUiFwmE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
