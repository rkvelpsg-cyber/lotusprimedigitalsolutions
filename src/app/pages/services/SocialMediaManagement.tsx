"use client";

import { Share2 } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function SocialMediaManagement() {
  return (
    <ServicePageTemplate
      icon={Share2}
      title="Social Media Management"
      description="Build and engage your community across social platforms. Professional social media management that drives brand awareness and customer loyalty."
      heroImage="https://images.unsplash.com/photo-1759215524649-78b47fc790e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "Content Creation",
          description:
            "Eye-catching posts, graphics, and videos tailored to each platform.",
        },
        {
          title: "Community Management",
          description:
            "Engage with your audience and build meaningful relationships.",
        },
        {
          title: "Social Listening",
          description: "Monitor brand mentions and industry conversations.",
        },
        {
          title: "Influencer Marketing",
          description: "Partner with influencers to expand your reach.",
        },
        {
          title: "Social Advertising",
          description:
            "Targeted ad campaigns on Facebook, Instagram, LinkedIn, and more.",
        },
        {
          title: "Performance Analytics",
          description:
            "Track engagement, growth, and ROI across all platforms.",
        },
      ]}
      benefits={[
        {
          title: "Brand Awareness",
          description:
            "Increase visibility and reach new audiences organically.",
        },
        {
          title: "Customer Engagement",
          description:
            "Build relationships and foster brand loyalty through interaction.",
        },
        {
          title: "Drive Traffic",
          description:
            "Direct social media followers to your website and landing pages.",
        },
        {
          title: "Crisis Management",
          description:
            "Protect your brand reputation with proactive monitoring.",
        },
      ]}
      process={[
        {
          title: "Audit",
          description:
            "Review your current social media presence and strategy.",
        },
        {
          title: "Planning",
          description: "Develop content calendar and posting strategy.",
        },
        {
          title: "Creation",
          description: "Produce high-quality content aligned with your brand.",
        },
        {
          title: "Engage",
          description: "Manage interactions and grow your community.",
        },
      ]}
      gradientFrom="from-[#DB2777]"
      gradientTo="to-[#EC4899]"
    />
  );
}
