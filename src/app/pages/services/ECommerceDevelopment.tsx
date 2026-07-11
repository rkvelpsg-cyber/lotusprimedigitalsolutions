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
      overview={[
        "India's e-commerce market is growing at an extraordinary pace, and businesses of every size are moving their sales online. Lotus Prime Digital Solutions builds robust, scalable, and secure e-commerce websites and platforms that help businesses in Bangalore and across India sell more effectively online. Whether you need a simple product catalog with checkout or a full multi-vendor marketplace, we have the expertise to build it.",
        "We develop e-commerce solutions on leading platforms including WooCommerce, Shopify, Magento, and fully custom-built solutions using React, Next.js, and Node.js. Our e-commerce websites are optimized for mobile shopping, fast page loads, and SEO — critical factors that directly impact your search rankings and conversion rate. We integrate all major Indian and international payment gateways including Razorpay, PayU, Paytm, Stripe, and PayPal, along with GST-compliant invoicing, shipping integrations, and inventory management.",
        "Our e-commerce development process covers everything from product catalog setup, UI/UX design optimized for conversions, secure checkout flow, and post-launch marketing integrations (Google Shopping, Meta Pixel, email marketing). We also provide e-commerce SEO services to help your products rank on Google and drive organic sales. Businesses that invest in a professional e-commerce platform see average revenue growth of 25–40% in the first year. Get a free e-commerce consultation and project quote today.",
      ]}
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
