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
  metadataBase: new URL("https://www.lotusprimedigitalsolutions.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.lotusprimedigitalsolutions.com",
    siteName: "Lotus Prime Digital Solutions",
    title: "Lotus Prime Digital Solutions | End-to-End Digital & AI Solutions",
    description:
      "End-to-End Digital & AI Solutions for Modern Businesses — Bangalore, India.",
    images: [
      {
        url: "/logo.png",
        width: 1536,
        height: 1024,
        alt: "Lotus Prime Digital Solutions logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotus Prime Digital Solutions",
    description: "End-to-End Digital & AI Solutions for Modern Businesses.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon-32x32.png"],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "lv1wnbr1pv0WBP0RO2A7FKgiYv5uL577JU4BAUiFwmE",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lotus Prime Digital Solutions",
  url: "https://www.lotusprimedigitalsolutions.com",
  logo: "https://www.lotusprimedigitalsolutions.com/logo.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
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
