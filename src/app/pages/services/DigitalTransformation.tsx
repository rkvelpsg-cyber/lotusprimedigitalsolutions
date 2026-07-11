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
      overview={[
        "Digital transformation is no longer optional — it is a business imperative for organizations that want to remain competitive in the modern economy. At Lotus Prime Digital Solutions, we partner with businesses in Bangalore and across India to design and execute comprehensive digital transformation strategies that modernize operations, improve customer experiences, and create new revenue opportunities. We serve enterprises, MSMEs, healthcare organizations, educational institutions, and government bodies.",
        "Our end-to-end digital transformation services cover every dimension of your organization: digitizing core business processes, implementing modern ERP and CRM systems, migrating legacy applications to the cloud, deploying AI and automation to eliminate manual work, building digital customer touchpoints (website, mobile app, self-service portals), and establishing a data analytics culture with real-time business intelligence dashboards. We begin every engagement with a thorough digital maturity assessment to identify your highest-impact transformation opportunities.",
        "Successful digital transformation requires more than just technology — it requires change management, employee training, and a clear business case at every stage. Our transformation consultants work alongside your leadership and IT teams throughout the journey, ensuring technology adoption is smooth and measurable outcomes are achieved. Organizations that complete digital transformation programs report 20–30% improvements in operational efficiency, 15–25% revenue growth, and significantly improved employee and customer satisfaction. Begin your transformation journey with a free digital readiness assessment.",
      ]}
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
