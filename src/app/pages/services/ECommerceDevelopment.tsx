"use client";

import { ShoppingCart } from "lucide-react";
import { ServicePageTemplate } from "../../components/ServicePageTemplate";

export default function ECommerceDevelopment() {
  return (
    <ServicePageTemplate
      icon={ShoppingCart}
      title="E-Commerce Development"
      description="Build powerful online stores that convert visitors into customers. Full-featured e-commerce solutions with secure payments, inventory management, and more."
      heroImage="https://images.unsplash.com/photo-1539278383962-a7774385fa02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      features={[
        {
          title: "Product Management",
          description:
            "Easy-to-use system for managing products, variants, and inventory.",
        },
        {
          title: "Shopping Cart",
          description:
            "Seamless shopping experience with cart, wishlist, and checkout.",
        },
        {
          title: "Payment Gateway",
          description:
            "Secure payment processing with multiple payment options.",
        },
        {
          title: "Order Management",
          description:
            "Complete order processing, tracking, and fulfillment system.",
        },
        {
          title: "Customer Accounts",
          description:
            "User registration, profiles, order history, and preferences.",
        },
        {
          title: "Marketing Tools",
          description: "Coupons, discounts, email marketing, and promotions.",
        },
      ]}
      benefits={[
        {
          title: "24/7 Sales",
          description:
            "Sell products around the clock without physical store limitations.",
        },
        {
          title: "Global Reach",
          description: "Reach customers worldwide and expand your market.",
        },
        {
          title: "Lower Costs",
          description:
            "Reduce overhead compared to traditional brick-and-mortar stores.",
        },
        {
          title: "Data Insights",
          description: "Understand customer behavior with detailed analytics.",
        },
      ]}
      process={[
        {
          title: "Planning",
          description: "Define product catalog, features, and user experience.",
        },
        {
          title: "Design",
          description: "Create attractive, conversion-optimized store design.",
        },
        {
          title: "Development",
          description: "Build secure, scalable e-commerce platform.",
        },
        {
          title: "Launch",
          description:
            "Test thoroughly and deploy with payment gateway integration.",
        },
      ]}
      gradientFrom="from-[#059669]"
      gradientTo="to-[#10B981]"
    />
  );
}
