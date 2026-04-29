"use client";

import { Workflow } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function DigitalTransformation() {
  return (
    <ServicePageTemplate
      icon={Workflow}
      title="End-to-End Digital Transformation"
      description="Transform your entire organization with comprehensive digital solutions. From strategy to implementation, we guide you through every step of your digital journey."
      heroImage="https://images.unsplash.com/photo-1775709610612-c589e29679ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "Digital Strategy",
          description:
            "Comprehensive roadmap aligned with your business objectives.",
        },
        {
          title: "Process Digitization",
          description:
            "Transform manual processes into efficient digital workflows.",
        },
        {
          title: "Legacy Modernization",
          description:
            "Upgrade outdated systems with modern technology solutions.",
        },
        {
          title: "Change Management",
          description:
            "Support your team through organizational and cultural change.",
        },
        {
          title: "Integration Services",
          description: "Connect disparate systems for seamless data flow.",
        },
        {
          title: "Training & Support",
          description:
            "Comprehensive training programs for successful adoption.",
        },
      ]}
      benefits={[
        {
          title: "Competitive Advantage",
          description:
            "Stay ahead of competitors with modern digital capabilities.",
        },
        {
          title: "Operational Efficiency",
          description:
            "Streamline operations and reduce costs through automation.",
        },
        {
          title: "Better Customer Experience",
          description:
            "Deliver seamless experiences across all customer touchpoints.",
        },
        {
          title: "Future-Ready",
          description: "Build a flexible foundation for continuous innovation.",
        },
      ]}
      process={[
        {
          title: "Discovery",
          description: "Assess current state and define transformation vision.",
        },
        {
          title: "Strategy",
          description: "Develop comprehensive digital transformation roadmap.",
        },
        {
          title: "Implementation",
          description:
            "Execute phased rollout with minimal business disruption.",
        },
        {
          title: "Evolution",
          description: "Continuous improvement and optimization.",
        },
      ]}
      gradientFrom="from-[#0B3C5D]"
      gradientTo="to-[#1ABC9C]"
    />
  );
}
