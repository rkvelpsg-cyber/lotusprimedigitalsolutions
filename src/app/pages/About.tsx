import { motion } from "motion/react";
import { Target, Eye, Heart, Users, Award, TrendingUp } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description:
        "We constantly push boundaries to deliver cutting-edge solutions.",
    },
    {
      icon: Heart,
      title: "Client-Centric",
      description:
        "Your success is our success. We prioritize your needs and goals.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We maintain the highest standards in every project we deliver.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We work closely with you as partners in your digital journey.",
    },
  ];

  const stats = [
    { number: "10+", label: "Years Experience" },
    { number: "250+", label: "Projects Delivered" },
    { number: "180+", label: "Happy Clients" },
    { number: "9+", label: "Industries Served" },
  ];

  return (
    <div className="pt-28">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1758876203342-fc14c0bba67c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Team Collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3C5D]/90 to-[#1ABC9C]/85"></div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl mb-6">
              About Lotus Prime Digital Solutions
            </h1>
            <p className="text-lg text-white/90">
              Empowering businesses with innovative digital solutions since our
              inception. We transform ideas into reality through technology,
              creativity, and dedication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] rounded-3xl p-10 text-white"
            >
              <Target className="w-16 h-16 mb-6" />
              <h2 className="text-3xl mb-4">Our Mission</h2>
              <p className="text-lg text-white/90">
                To empower businesses of all sizes with intelligent, innovative,
                and accessible digital solutions that drive growth, efficiency,
                and success in the modern digital landscape.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-3xl p-10 text-white"
            >
              <Eye className="w-16 h-16 mb-6" />
              <h2 className="text-3xl mb-4">Our Vision</h2>
              <p className="text-lg text-white/90">
                To be the leading digital transformation partner, recognized for
                innovation, excellence, and creating lasting impact for
                businesses across industries through cutting-edge technology
                solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl text-[#0B3C5D] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl text-[#0B3C5D] mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Lotus Prime Digital Solutions was founded with a vision to
                  bridge the gap between businesses and cutting-edge technology.
                  We recognized that many organizations, especially MSMEs,
                  struggled to access enterprise-grade digital solutions.
                </p>
                <p>
                  Our team of passionate technologists, designers, and business
                  strategists came together to create a company that would
                  democratize access to advanced digital solutions. Today, we
                  serve enterprises, MSMEs, and institutions across diverse
                  industries.
                </p>
                <p>
                  From AI-powered automation to comprehensive digital
                  transformation, we've helped over 180 organizations achieve
                  their digital goals. Our success is measured not just by the
                  solutions we deliver, but by the lasting partnerships we build
                  and the tangible results our clients achieve.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1690378820474-b468b8ee64d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Team working together"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to Work Together?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Let's discuss how we can help transform your business
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-[#0B3C5D] px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
