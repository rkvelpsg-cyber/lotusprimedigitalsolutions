"use client";

import { Globe } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function WebsiteDevelopment() {
  return (
    <ServicePageTemplate
      icon={Globe}
      title="Website Development"
      description="Create stunning, responsive websites that drive engagement and conversions. Our expert team delivers custom web solutions tailored to your business needs."
      heroImage="https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      overview={[
        "Your website is your most powerful digital asset — it is the first impression millions of potential customers will have of your business. At Lotus Prime Digital Solutions, we create high-performance, SEO-optimized, and visually stunning websites that not only look great but also generate real business results. From corporate websites and landing pages to complex web portals and progressive web apps (PWAs), we build for Bangalore businesses and clients across India.",
        "Our web development team specializes in React, Next.js, Node.js, WordPress, and custom full-stack solutions. Every website we build is mobile-first, loads in under 2 seconds, and follows Google's Core Web Vitals guidelines — ensuring maximum search engine visibility and user satisfaction. We integrate essential business features including contact forms, live chat, booking systems, payment gateways, and CMS platforms so you can manage your content without technical knowledge.",
        "We have delivered websites across industries including healthcare, education, real estate, manufacturing, retail, and professional services. Our process covers discovery and planning, UI/UX design, development, quality assurance, SEO setup, and post-launch support. Whether you need a simple brochure website or a full-featured business platform, we deliver on time and within budget. Request a free website consultation today to see how we can transform your online presence.",
      ]}
      features={[
        {
          title: "Responsive Design",
          description:
            "Mobile-first approach ensuring perfect display across all devices and screen sizes.",
        },
        {
          title: "Modern Technologies",
          description:
            "Built with cutting-edge frameworks like React, Next.js, and Node.js for optimal performance.",
        },
        {
          title: "SEO Optimized",
          description:
            "Structured for search engine visibility to help your business get discovered online.",
        },
        {
          title: "Fast Loading",
          description:
            "Optimized code and assets for lightning-fast page load times.",
        },
        {
          title: "CMS Integration",
          description:
            "Easy content management with WordPress, Strapi, or custom CMS solutions.",
        },
        {
          title: "Security First",
          description:
            "Industry-standard security practices to protect your website and user data.",
        },
      ]}
      benefits={[
        {
          title: "Increased Online Presence",
          description:
            "Establish a professional digital presence that builds trust with your audience.",
        },
        {
          title: "Better User Experience",
          description:
            "Intuitive navigation and design that keeps visitors engaged and converts them into customers.",
        },
        {
          title: "Scalable Solutions",
          description:
            "Built to grow with your business, easily adding new features and functionality.",
        },
        {
          title: "24/7 Availability",
          description:
            "Your website works around the clock, reaching customers globally.",
        },
      ]}
      process={[
        {
          title: "Discovery",
          description:
            "Understanding your goals, target audience, and requirements.",
        },
        {
          title: "Design",
          description:
            "Creating wireframes and visual designs for your approval.",
        },
        {
          title: "Development",
          description: "Building your website with clean, maintainable code.",
        },
        {
          title: "Launch",
          description: "Testing, deployment, and ongoing support.",
        },
      ]}
    />
  );
}
