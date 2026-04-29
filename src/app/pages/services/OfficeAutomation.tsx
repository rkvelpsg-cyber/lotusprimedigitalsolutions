"use client";

import { FileText } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function OfficeAutomation() {
  return (
    <ServicePageTemplate
      icon={FileText}
      title="Office Automation"
      description="Streamline your office operations with intelligent automation solutions. Reduce manual work, eliminate errors, and boost productivity across your organization."
      heroImage="https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "Document Management",
          description:
            "Automated document creation, routing, and archival systems.",
        },
        {
          title: "Workflow Automation",
          description:
            "Custom workflows that automate repetitive business processes.",
        },
        {
          title: "Email Automation",
          description:
            "Automate email communications, follow-ups, and notifications.",
        },
        {
          title: "Data Entry Automation",
          description:
            "Eliminate manual data entry with intelligent form processing.",
        },
        {
          title: "Reporting & Analytics",
          description: "Automated report generation and real-time dashboards.",
        },
        {
          title: "Integration",
          description: "Connect all your office tools for seamless data flow.",
        },
      ]}
      benefits={[
        {
          title: "Time Savings",
          description: "Free up employee time by automating repetitive tasks.",
        },
        {
          title: "Error Reduction",
          description:
            "Minimize human errors in data processing and documentation.",
        },
        {
          title: "Cost Efficiency",
          description: "Reduce operational costs through improved efficiency.",
        },
        {
          title: "Better Compliance",
          description:
            "Maintain consistent processes and audit trails for compliance.",
        },
      ]}
      process={[
        {
          title: "Analysis",
          description: "Identify processes that can benefit from automation.",
        },
        {
          title: "Design",
          description: "Map out automated workflows and system architecture.",
        },
        {
          title: "Implementation",
          description: "Deploy automation solutions with minimal disruption.",
        },
        {
          title: "Training",
          description: "Train your team and provide ongoing support.",
        },
      ]}
      gradientFrom="from-[#0891B2]"
      gradientTo="to-[#06B6D4]"
    />
  );
}
