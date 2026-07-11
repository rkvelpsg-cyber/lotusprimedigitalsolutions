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
      overview={[
        "Manual, paper-based, and repetitive office processes cost your business time, money, and accuracy every single day. Lotus Prime Digital Solutions helps organizations in Bangalore and across India automate their office operations — from document management and HR processes to approval workflows and financial reporting — using modern automation platforms and custom software. Our office automation solutions free your staff from tedious manual work so they can focus on value-added activities.",
        "We design and implement automation solutions for a wide range of business functions: automated invoice processing and accounts payable, HR onboarding and leave management workflows, purchase order and approval systems, email and notification automation, report generation and scheduling, and integration between your existing business applications (ERP, CRM, accounting software). Our tools include Microsoft Power Automate, Zapier, UiPath RPA, and custom-built workflow engines.",
        "Organizations that implement office automation typically see a 40–70% reduction in processing time, near-elimination of manual data entry errors, and significant cost savings within the first year. More importantly, automated workflows provide full audit trails and compliance documentation — critical for industries like manufacturing, healthcare, and financial services. Our team conducts a thorough process audit before recommending automation solutions, ensuring we target the highest-impact workflows first. Book a free process automation consultation today.",
      ]}
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
