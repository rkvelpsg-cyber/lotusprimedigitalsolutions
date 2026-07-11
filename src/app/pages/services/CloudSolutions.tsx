"use client";

import { Cloud } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function CloudSolutions() {
  return (
    <ServicePageTemplate
      icon={Cloud}
      title="Cloud Solutions"
      description="Modernize your infrastructure with scalable, secure cloud solutions. Leverage AWS, Azure, and Google Cloud for flexibility, reliability, and cost savings."
      heroImage="https://images.unsplash.com/photo-1667984390527-850f63192709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      overview={[
        "Cloud computing has fundamentally changed how businesses build, deploy, and scale their technology infrastructure. At Lotus Prime Digital Solutions, we provide comprehensive cloud solutions to help businesses in Bangalore and across India migrate to the cloud, modernize their architecture, and reduce IT costs. Whether you are adopting cloud for the first time or optimizing an existing cloud environment, our certified cloud architects deliver secure, scalable, and cost-effective solutions.",
        "We work with all major cloud platforms — Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) — and help you choose the right provider or multi-cloud strategy based on your specific workloads, compliance requirements, and budget. Our services include cloud migration, application modernization, DevOps implementation, serverless architecture, containerization with Docker and Kubernetes, and 24/7 cloud infrastructure monitoring.",
        "Cloud adoption delivers tangible business benefits: reduce your IT capital expenditure by 30–50%, scale compute resources on demand during peak seasons, improve application availability with 99.9% uptime SLAs, and strengthen data security with enterprise-grade compliance frameworks. Our cloud-first approach ensures your applications are built for resilience, performance, and agility. Get in touch today for a free cloud assessment and migration roadmap.",
      ]}
      features={[
        {
          title: "Cloud Migration",
          description:
            "Seamless migration of applications and data to the cloud.",
        },
        {
          title: "Infrastructure as Code",
          description: "Automated infrastructure deployment and management.",
        },
        {
          title: "Serverless Architecture",
          description: "Build scalable applications without managing servers.",
        },
        {
          title: "Cloud Security",
          description: "Enterprise-grade security and compliance measures.",
        },
        {
          title: "Disaster Recovery",
          description: "Backup and recovery solutions for business continuity.",
        },
        {
          title: "Cost Optimization",
          description: "Monitor and optimize cloud spending for maximum ROI.",
        },
      ]}
      benefits={[
        {
          title: "Scalability",
          description:
            "Scale resources up or down based on demand without capital investment.",
        },
        {
          title: "Cost Savings",
          description:
            "Pay only for what you use with flexible pricing models.",
        },
        {
          title: "Global Reach",
          description:
            "Deploy applications closer to users worldwide for better performance.",
        },
        {
          title: "Innovation",
          description: "Access cutting-edge technologies like AI, ML, and IoT.",
        },
      ]}
      process={[
        {
          title: "Assessment",
          description:
            "Evaluate your current infrastructure and cloud readiness.",
        },
        {
          title: "Planning",
          description: "Design cloud architecture and migration strategy.",
        },
        {
          title: "Migration",
          description: "Execute phased migration with minimal downtime.",
        },
        {
          title: "Optimization",
          description: "Monitor and optimize performance and costs.",
        },
      ]}
      gradientFrom="from-[#0284C7]"
      gradientTo="to-[#0EA5E9]"
    />
  );
}
