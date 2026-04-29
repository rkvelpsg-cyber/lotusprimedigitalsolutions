"use client";

import { TrendingUp } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function DigitalMarketing() {
  return (
    <ServicePageTemplate
      icon={TrendingUp}
      title="Digital Marketing"
      description="Drive growth with data-driven digital marketing strategies. Reach your target audience, increase brand awareness, and generate quality leads that convert."
      heroImage="https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "SEO Services",
          description:
            "Improve search engine rankings and drive organic traffic to your website.",
        },
        {
          title: "PPC Advertising",
          description:
            "Targeted Google Ads and social media advertising campaigns.",
        },
        {
          title: "Content Marketing",
          description:
            "Engaging content that attracts and retains your ideal customers.",
        },
        {
          title: "Email Marketing",
          description:
            "Personalized email campaigns that nurture leads and drive sales.",
        },
        {
          title: "Analytics & Reporting",
          description:
            "Track ROI with comprehensive marketing analytics and insights.",
        },
        {
          title: "Conversion Optimization",
          description:
            "A/B testing and optimization to maximize conversion rates.",
        },
      ]}
      benefits={[
        {
          title: "Increased Visibility",
          description:
            "Get found by customers searching for your products or services online.",
        },
        {
          title: "Higher ROI",
          description:
            "Data-driven strategies that deliver measurable return on investment.",
        },
        {
          title: "Brand Authority",
          description:
            "Establish your brand as an industry leader and trusted authority.",
        },
        {
          title: "Scalable Growth",
          description: "Marketing strategies that grow with your business.",
        },
      ]}
      process={[
        {
          title: "Research",
          description: "Analyze your market, competitors, and target audience.",
        },
        {
          title: "Strategy",
          description: "Develop a comprehensive digital marketing plan.",
        },
        {
          title: "Execution",
          description: "Launch campaigns across multiple channels.",
        },
        {
          title: "Optimize",
          description: "Continuously refine based on performance data.",
        },
      ]}
      gradientFrom="from-[#EA580C]"
      gradientTo="to-[#F59E0B]"
    />
  );
}
