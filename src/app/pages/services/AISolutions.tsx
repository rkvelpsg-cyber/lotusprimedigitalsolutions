"use client";

import { Brain } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function AISolutions() {
  return (
    <ServicePageTemplate
      icon={Brain}
      title="AI Solutions"
      description="Harness the power of artificial intelligence to automate processes, gain insights, and make data-driven decisions. Transform your business with intelligent AI solutions."
      heroImage="https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      overview={[
        "Artificial Intelligence is no longer a futuristic concept — it is a practical business tool that is transforming industries worldwide. At Lotus Prime Digital Solutions, we design and deliver end-to-end AI solutions for businesses in Bangalore and across India, helping organizations of all sizes automate operations, uncover hidden insights, and build smarter customer experiences. Whether you are a startup looking to leverage AI for the first time or an enterprise seeking to scale intelligent automation, our team has the expertise and experience to guide you.",
        "Our AI services span the full spectrum: machine learning model development, natural language processing (NLP) for chatbots and document analysis, computer vision for quality control and object recognition, predictive analytics for demand forecasting, and robotic process automation (RPA) to eliminate repetitive manual work. We build custom AI models trained on your specific data, ensuring accuracy and relevance to your unique business context.",
        "Industries we serve include manufacturing, healthcare, retail, logistics, education, and financial services. Our proven AI implementation methodology — starting with a business assessment, followed by data strategy, model development, integration, and continuous optimization — ensures that every AI project delivers measurable ROI. Reduce operational costs by up to 60%, improve decision-making accuracy, and give your team the tools to focus on high-value work. Contact us today for a free AI readiness consultation.",
      ]}
      features={[
        {
          title: "Machine Learning Models",
          description:
            "Custom ML models trained on your data for accurate predictions and classifications.",
        },
        {
          title: "Natural Language Processing",
          description:
            "Understand and process human language for chatbots, sentiment analysis, and more.",
        },
        {
          title: "Computer Vision",
          description:
            "Image and video analysis for quality control, object detection, and facial recognition.",
        },
        {
          title: "Predictive Analytics",
          description:
            "Forecast trends and outcomes to make proactive business decisions.",
        },
        {
          title: "Process Automation",
          description:
            "Automate repetitive tasks with intelligent bots and workflows.",
        },
        {
          title: "AI Integration",
          description:
            "Seamlessly integrate AI capabilities into your existing systems.",
        },
      ]}
      benefits={[
        {
          title: "Reduced Operational Costs",
          description:
            "Automate manual processes and reduce labor costs by up to 60%.",
        },
        {
          title: "Enhanced Decision Making",
          description:
            "Data-driven insights help you make better strategic decisions.",
        },
        {
          title: "Improved Accuracy",
          description:
            "AI reduces human error and improves consistency in operations.",
        },
        {
          title: "Competitive Advantage",
          description:
            "Stay ahead of competitors with cutting-edge AI technology.",
        },
      ]}
      process={[
        {
          title: "Assessment",
          description:
            "Identify opportunities where AI can add value to your business.",
        },
        {
          title: "Strategy",
          description:
            "Develop an AI roadmap aligned with your business goals.",
        },
        {
          title: "Development",
          description: "Build and train AI models using your data.",
        },
        {
          title: "Deployment",
          description:
            "Integrate AI solutions into your workflows with ongoing optimization.",
        },
      ]}
      gradientFrom="from-[#5B21B6]"
      gradientTo="to-[#7C3AED]"
    />
  );
}
