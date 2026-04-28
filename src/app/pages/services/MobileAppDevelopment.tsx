import { Smartphone } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function MobileAppDevelopment() {
  return (
    <ServicePageTemplate
      icon={Smartphone}
      title="Mobile App Development"
      description="Build powerful native and cross-platform mobile applications that engage users and drive business growth. Reach your customers wherever they are."
      heroImage="https://images.unsplash.com/photo-1762341119237-98df67c9c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "iOS & Android Apps",
          description: "Native apps for both platforms or cross-platform solutions using React Native and Flutter.",
        },
        {
          title: "Intuitive UI/UX",
          description: "User-friendly interfaces designed for mobile-first experiences.",
        },
        {
          title: "Offline Functionality",
          description: "Work seamlessly even without internet connectivity.",
        },
        {
          title: "Push Notifications",
          description: "Keep users engaged with timely and relevant notifications.",
        },
        {
          title: "API Integration",
          description: "Connect to your backend services, third-party APIs, and cloud platforms.",
        },
        {
          title: "App Store Deployment",
          description: "End-to-end support for publishing on Apple App Store and Google Play.",
        },
      ]}
      benefits={[
        {
          title: "Direct Customer Access",
          description: "Reach customers directly on their most-used device.",
        },
        {
          title: "Increased Engagement",
          description: "Mobile apps have higher engagement rates than mobile websites.",
        },
        {
          title: "Brand Recognition",
          description: "Strengthen brand presence with a dedicated app on users' devices.",
        },
        {
          title: "Revenue Growth",
          description: "Enable in-app purchases, subscriptions, and mobile commerce.",
        },
      ]}
      process={[
        {
          title: "Planning",
          description: "Define features, user flows, and technical requirements.",
        },
        {
          title: "Design",
          description: "Create stunning UI/UX designs following platform guidelines.",
        },
        {
          title: "Development",
          description: "Build the app with clean code and best practices.",
        },
        {
          title: "Launch",
          description: "Test thoroughly and deploy to app stores.",
        },
      ]}
      gradientFrom="from-[#DC2626]"
      gradientTo="to-[#F97316]"
    />
  );
}
