import type { Metadata } from "next";
import ECommerceDevelopment from "../../pages/services/ECommerceDevelopment";

export const metadata: Metadata = {
  title:
    "E-Commerce Development | Online Store & Marketplace — Bangalore, India",
  description:
    "E-commerce website development in Bangalore using Shopify, WooCommerce, Magento, and custom solutions. We build fast, mobile-friendly online stores with Razorpay, PayU, and Stripe integrations for businesses across India.",
  keywords: [
    "e-commerce development Bangalore",
    "online store development India",
    "Shopify development Bangalore",
    "WooCommerce development India",
    "Magento development",
    "e-commerce website India",
    "Razorpay integration",
    "online shopping website Bangalore",
    "e-commerce SEO India",
    "multi-vendor marketplace development",
  ],
  openGraph: {
    title: "E-Commerce Development | Lotus Prime Digital Solutions",
    description:
      "Custom e-commerce websites and online stores built with Shopify, WooCommerce, and custom solutions for businesses across Bangalore and India.",
    url: "https://www.lotusprimedigitalsolutions.com/services/ecommerce-development",
  },
};

export default function Page() {
  return <ECommerceDevelopment />;
}
