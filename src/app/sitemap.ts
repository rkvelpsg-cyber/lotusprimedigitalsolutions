import type { MetadataRoute } from "next";

const baseUrl = "https://www.lotusprimedigital.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/contact",
    "/services/website-development",
    "/services/ai-solutions",
    "/services/mobile-app-development",
    "/services/office-automation",
    "/services/digital-marketing",
    "/services/social-media-management",
    "/services/cloud-solutions",
    "/services/crm-solutions",
    "/services/ecommerce-development",
    "/services/digital-transformation",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
