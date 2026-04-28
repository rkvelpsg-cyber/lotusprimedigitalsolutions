import { Brain } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function AISolutions() {
  return (
    <ServicePageTemplate
      icon={Brain}
      title="AI Solutions"
      description="Harness the power of artificial intelligence to automate processes, gain insights, and make data-driven decisions. Transform your business with intelligent AI solutions."
      heroImage="https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "Machine Learning Models",
          description: "Custom ML models trained on your data for accurate predictions and classifications.",
        },
        {
          title: "Natural Language Processing",
          description: "Understand and process human language for chatbots, sentiment analysis, and more.",
        },
        {
          title: "Computer Vision",
          description: "Image and video analysis for quality control, object detection, and facial recognition.",
        },
        {
          title: "Predictive Analytics",
          description: "Forecast trends and outcomes to make proactive business decisions.",
        },
        {
          title: "Process Automation",
          description: "Automate repetitive tasks with intelligent bots and workflows.",
        },
        {
          title: "AI Integration",
          description: "Seamlessly integrate AI capabilities into your existing systems.",
        },
      ]}
      benefits={[
        {
          title: "Reduced Operational Costs",
          description: "Automate manual processes and reduce labor costs by up to 60%.",
        },
        {
          title: "Enhanced Decision Making",
          description: "Data-driven insights help you make better strategic decisions.",
        },
        {
          title: "Improved Accuracy",
          description: "AI reduces human error and improves consistency in operations.",
        },
        {
          title: "Competitive Advantage",
          description: "Stay ahead of competitors with cutting-edge AI technology.",
        },
      ]}
      process={[
        {
          title: "Assessment",
          description: "Identify opportunities where AI can add value to your business.",
        },
        {
          title: "Strategy",
          description: "Develop an AI roadmap aligned with your business goals.",
        },
        {
          title: "Development",
          description: "Build and train AI models using your data.",
        },
        {
          title: "Deployment",
          description: "Integrate AI solutions into your workflows with ongoing optimization.",
        },
      ]}
      gradientFrom="from-[#5B21B6]"
      gradientTo="to-[#7C3AED]"
    />
  );
}
