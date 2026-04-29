"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Globe,
  Brain,
  Smartphone,
  FileText,
  TrendingUp,
  Share2,
  Cloud,
  Users,
  ShoppingCart,
  Workflow,
  Building2,
  Factory,
  Hospital,
  GraduationCap,
  Store,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Headphones,
} from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";
import { IndustryCard } from "../components/IndustryCard";
import { StatsCounter } from "../components/StatsCounter";
import { TestimonialCard } from "../components/TestimonialCard";
import { HeroSlider } from "../components/HeroSlider";

export default function Home() {
  const services = [
    {
      icon: Globe,
      title: "Website Development",
      description: "Custom, responsive websites built with modern technologies",
      link: "/services/website-development",
    },
    {
      icon: Brain,
      title: "AI Solutions",
      description: "Intelligent automation and AI-powered business solutions",
      link: "/services/ai-solutions",
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications",
      link: "/services/mobile-app-development",
    },
    {
      icon: FileText,
      title: "Office Automation",
      description: "Streamline operations with automated workflows",
      link: "/services/office-automation",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description: "Data-driven marketing strategies for growth",
      link: "/services/digital-marketing",
    },
    {
      icon: Share2,
      title: "Social Media Management",
      description: "Build your brand across social platforms",
      link: "/services/social-media-management",
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and migration",
      link: "/services/cloud-solutions",
    },
    {
      icon: Users,
      title: "CRM Solutions",
      description: "Customer relationship management systems",
      link: "/services/crm-solutions",
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Development",
      description: "Complete online store solutions",
      link: "/services/ecommerce-development",
    },
    {
      icon: Workflow,
      title: "Digital Transformation",
      description: "End-to-end digital transformation services",
      link: "/services/digital-transformation",
    },
  ];

  const industries = [
    { icon: Building2, name: "Enterprises" },
    { icon: Store, name: "MSMEs" },
    { icon: Factory, name: "Manufacturing" },
    { icon: Hospital, name: "Hospitals" },
    { icon: GraduationCap, name: "Educational Institutions" },
    { icon: Users, name: "Coaching Institutes" },
    { icon: Building2, name: "Construction" },
    { icon: ShoppingCart, name: "Retail" },
    { icon: DollarSign, name: "Financial Services" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "TechVision Industries",
      text: "Lotus Prime transformed our digital presence completely. Their AI solutions helped us automate 60% of our operations.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1717068341511-204207d72705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Priya Sharma",
      company: "EduCare Institute",
      text: "Outstanding service and support. The mobile app they developed has increased our student engagement by 300%.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
    {
      name: "Anand Reddy",
      company: "HealthFirst Hospital",
      text: "Professional team with deep technical expertise. Their cloud solutions made our operations seamless.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    },
  ];

  return (
    <div className="pt-28">
      {/* Hero Section - Full Width Slider */}
      <section className="relative h-screen min-h-[600px] max-h-[900px]">
        <HeroSlider />
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-600">
              Delivering excellence across diverse industry sectors
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {industries.map((industry, index) => (
              <IndustryCard key={index} {...industry} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose Us</h2>
            <p className="text-lg text-white/90">
              Your trusted partner for digital transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Innovation Driven",
                description:
                  "We leverage cutting-edge technologies to deliver solutions that keep you ahead of the competition.",
              },
              {
                icon: Shield,
                title: "AI-Powered Solutions",
                description:
                  "Harness the power of artificial intelligence to automate processes and gain valuable insights.",
              },
              {
                icon: Headphones,
                title: "End-to-End Support",
                description:
                  "From consultation to deployment and beyond, we're with you every step of the way.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300"
              >
                <item.icon className="w-16 h-16 mx-auto mb-4 text-[#1ABC9C]" />
                <h3 className="text-xl mb-3">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1590650589327-3f67c43ad8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Team Collaboration"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B3C5D]/80 to-[#1ABC9C]/80"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-6">
                Transform Your Business with Intelligent Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Transform your business with intelligent automation, digital
                platforms, and AI-powered insights that drive growth and
                efficiency.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Custom software development tailored to your needs",
                  "Scalable cloud infrastructure for growing businesses",
                  "AI and machine learning integration",
                  "24/7 technical support and maintenance",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#1ABC9C] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-[#0B3C5D] to-[#1ABC9C] text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300"
              >
                Request Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCounter end={250} label="Projects Completed" suffix="+" />
            <StatsCounter end={180} label="Clients Served" suffix="+" />
            <StatsCounter end={9} label="Industries Covered" suffix="+" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by businesses across industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Let's discuss how we can help you achieve your digital goals
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-[#0B3C5D] px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
