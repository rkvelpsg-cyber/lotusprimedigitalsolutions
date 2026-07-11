import type { Metadata } from "next";
import "@/styles/index.css";
import { LayoutWrapper } from "./components/layout/LayoutWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default:
      "Lotus Prime Digital Solutions | Digital & AI Solutions Company — Bangalore, India",
    template: "%s | Lotus Prime Digital Solutions",
  },
  description:
    "Lotus Prime Digital Solutions is a leading digital transformation company in Bangalore, India. We deliver Website Development, AI Solutions, Mobile App Development, Cloud Services, CRM, Digital Marketing, E-Commerce, Office Automation, and Social Media Management for businesses across India.",
  keywords: [
    "digital solutions Bangalore",
    "AI solutions India",
    "website development Bangalore",
    "mobile app development India",
    "cloud solutions Bangalore",
    "digital marketing agency India",
    "CRM solutions Bangalore",
    "e-commerce development India",
    "office automation Bangalore",
    "social media management India",
    "digital transformation company Bangalore",
    "IT company Whitefield Bangalore",
    "software development India",
    "business automation solutions",
    "SEO services Bangalore",
  ],
  authors: [{ name: "Lotus Prime Digital Solutions" }],
  creator: "Lotus Prime Digital Solutions",
  metadataBase: new URL("https://www.lotusprimedigitalsolutions.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.lotusprimedigitalsolutions.com",
    siteName: "Lotus Prime Digital Solutions",
    title:
      "Lotus Prime Digital Solutions | Digital & AI Solutions — Bangalore, India",
    description:
      "Leading digital transformation company in Bangalore offering Website Development, AI Solutions, Mobile Apps, Cloud, CRM, and Digital Marketing services across India.",
    images: [
      {
        url: "/logo.png",
        width: 1536,
        height: 1024,
        alt: "Lotus Prime Digital Solutions — Digital & AI Solutions Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotus Prime Digital Solutions | Digital & AI Solutions — Bangalore",
    description:
      "Website Development, AI Solutions, Mobile Apps, Cloud, CRM, and Digital Marketing for businesses across India.",
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
  "@type": "LocalBusiness",
  name: "Lotus Prime Digital Solutions",
  url: "https://www.lotusprimedigitalsolutions.com",
  logo: "https://www.lotusprimedigitalsolutions.com/logo.png",
  image: "https://www.lotusprimedigitalsolutions.com/logo.png",
  description:
    "Lotus Prime Digital Solutions is a digital transformation company in Bangalore, India, offering Website Development, AI Solutions, Mobile App Development, Cloud Services, CRM, Digital Marketing, E-Commerce, and Office Automation.",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "SSK Residency, Vinayaka Layout, 1st Cross, Food Corporation of India Main Road, Whitefield-Kadugodi",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    postalCode: "560067",
    addressCountry: "IN",
  },
  telephone: "+91-9363070456",
  email: "info@lotusprimedigitalsolutions.com",
  areaServed: ["Bangalore", "India"],
  serviceType: [
    "Website Development",
    "AI Solutions",
    "Mobile App Development",
    "Cloud Solutions",
    "CRM Solutions",
    "Digital Marketing",
    "E-Commerce Development",
    "Office Automation",
    "Social Media Management",
    "Digital Transformation",
  ],
  sameAs: [],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "16:00",
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lotus Prime Digital Solutions",
  url: "https://www.lotusprimedigitalsolutions.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.lotusprimedigitalsolutions.com/?s={search_term_string}",
    },
    "query-input": "required name=search_term_string",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <Toaster position="top-right" richColors />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
