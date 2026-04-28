import { Users } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function CRMSolutions() {
  return (
    <ServicePageTemplate
      icon={Users}
      title="CRM Solutions"
      description="Manage customer relationships effectively with powerful CRM systems. Increase sales, improve customer service, and make data-driven business decisions."
      heroImage="https://images.unsplash.com/photo-1752650735943-d0fbf1edce21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "Contact Management",
          description: "Centralize all customer information and interaction history.",
        },
        {
          title: "Sales Pipeline",
          description: "Track deals through every stage of your sales process.",
        },
        {
          title: "Marketing Automation",
          description: "Automate email campaigns and lead nurturing workflows.",
        },
        {
          title: "Customer Support",
          description: "Manage tickets, track issues, and improve response times.",
        },
        {
          title: "Analytics & Reports",
          description: "Gain insights with customizable dashboards and reports.",
        },
        {
          title: "Mobile Access",
          description: "Access CRM data on-the-go with mobile applications.",
        },
      ]}
      benefits={[
        {
          title: "Increased Sales",
          description: "Close more deals with better lead management and follow-up.",
        },
        {
          title: "Better Customer Service",
          description: "Respond faster and provide personalized customer experiences.",
        },
        {
          title: "Team Collaboration",
          description: "Keep your team aligned with shared customer information.",
        },
        {
          title: "Data-Driven Decisions",
          description: "Make informed decisions based on real customer data.",
        },
      ]}
      process={[
        {
          title: "Requirements",
          description: "Understand your sales process and customer journey.",
        },
        {
          title: "Customization",
          description: "Configure CRM to match your business workflows.",
        },
        {
          title: "Integration",
          description: "Connect with your existing tools and systems.",
        },
        {
          title: "Training",
          description: "Train your team for successful CRM adoption.",
        },
      ]}
      gradientFrom="from-[#7C3AED]"
      gradientTo="to-[#A78BFA]"
    />
  );
}
