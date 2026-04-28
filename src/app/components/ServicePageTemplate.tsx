import { Link } from "react-router";
import { motion } from "motion/react";
import { LucideIcon, ArrowRight, CheckCircle } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface ServicePageTemplateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: Feature[];
  benefits: Benefit[];
  process: ProcessStep[];
  gradientFrom?: string;
  gradientTo?: string;
  heroImage?: string;
}

export function ServicePageTemplate({
  icon: Icon,
  title,
  description,
  features,
  benefits,
  process,
  gradientFrom = "from-[#0B3C5D]",
  gradientTo = "to-[#1ABC9C]",
  heroImage,
}: ServicePageTemplateProps) {
  return (
    <div className="pt-28">
      {/* Hero Banner */}
      <section
        className={`relative py-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl mb-6">{title}</h1>
              <p className="text-lg text-white/90 mb-8">{description}</p>
              <Link
                to="/contact"
                className="inline-flex items-center bg-white text-[#0B3C5D] px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300"
              >
                Request Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                {heroImage ? (
                  <>
                    <img
                      src={heroImage}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B3C5D]/30 to-[#1ABC9C]/30"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-48 h-48 text-white/20" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive features designed for your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <CheckCircle className="w-10 h-10 text-[#1ABC9C] mb-4" />
                <h3 className="text-xl text-[#0B3C5D] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Why choose our {title.toLowerCase()} services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-[#0B3C5D] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl text-[#0B3C5D] mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600">
              A systematic approach to deliver excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center"
              >
                <div className="bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] text-white rounded-2xl p-6 text-center w-full">
                  <div className="text-4xl mb-4">{index + 1}</div>
                  <h3 className="text-lg mb-3">{step.title}</h3>
                  <p className="text-sm text-white/90">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 rounded-full bg-white shadow">
                    <ArrowRight className="w-5 h-5 text-[#1ABC9C]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className={`py-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-white/90 mb-8">
              Let's discuss how our {title.toLowerCase()} can benefit your
              business
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-[#0B3C5D] px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300"
            >
              Request Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
