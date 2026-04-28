import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLink?: string;
}

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "Website Development",
    subtitle: "Custom Web Solutions",
    description:
      "Create stunning, responsive websites that drive engagement and conversions. Modern technologies, SEO optimized, and built to scale with your business needs.",
    ctaLink: "/services/website-development",
  },
  {
    image:
      "https://images.unsplash.com/photo-1675557009483-e6cf3867976b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "AI Solutions",
    subtitle: "Intelligent Automation",
    description:
      "Harness the power of artificial intelligence to automate processes, gain insights, and make data-driven decisions that transform your business operations.",
    ctaLink: "/services/ai-solutions",
  },
  {
    image:
      "https://images.unsplash.com/photo-1762341119237-98df67c9c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "Mobile App Development",
    subtitle: "iOS & Android Apps",
    description:
      "Build powerful native and cross-platform mobile applications that engage users and drive business growth. Reach your customers wherever they are.",
    ctaLink: "/services/mobile-app-development",
  },
  {
    image:
      "https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "Office Automation",
    subtitle: "Workflow Optimization",
    description:
      "Streamline your office operations with intelligent automation solutions. Reduce manual work, eliminate errors, and boost productivity across your organization.",
    ctaLink: "/services/office-automation",
  },
  {
    image:
      "https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "Digital Marketing",
    subtitle: "Data-Driven Growth",
    description:
      "Drive growth with comprehensive digital marketing strategies. SEO, PPC, content marketing, and analytics that deliver measurable ROI for your business.",
    ctaLink: "/services/digital-marketing",
  },
  {
    image:
      "https://images.unsplash.com/photo-1759215524649-78b47fc790e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "Social Media Management",
    subtitle: "Brand Engagement",
    description:
      "Build and engage your community across social platforms. Professional social media management that drives brand awareness and customer loyalty.",
    ctaLink: "/services/social-media-management",
  },
  {
    image:
      "https://images.unsplash.com/photo-1667984390527-850f63192709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "Cloud Solutions",
    subtitle: "Scalable Infrastructure",
    description:
      "Modernize your infrastructure with secure, scalable cloud solutions. Leverage AWS, Azure, and Google Cloud for flexibility, reliability, and cost savings.",
    ctaLink: "/services/cloud-solutions",
  },
  {
    image:
      "https://images.unsplash.com/photo-1752650735943-d0fbf1edce21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "CRM Solutions",
    subtitle: "Customer Success",
    description:
      "Manage customer relationships effectively with powerful CRM systems. Increase sales, improve customer service, and make data-driven business decisions.",
    ctaLink: "/services/crm-solutions",
  },
  {
    image:
      "https://images.unsplash.com/photo-1539278383962-a7774385fa02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "E-Commerce Development",
    subtitle: "Online Store Solutions",
    description:
      "Build powerful online stores that convert visitors into customers. Complete e-commerce solutions with secure payments, inventory management, and marketing tools.",
    ctaLink: "/services/ecommerce-development",
  },
  {
    image:
      "https://images.unsplash.com/photo-1759661937582-0ccd5dacf20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2400",
    title: "End-to-End Digital Transformation",
    subtitle: "Complete Business Evolution",
    description:
      "Transform your entire organization with comprehensive digital solutions. From strategy to implementation, we guide you through every step of your digital journey.",
    ctaLink: "/services/digital-transformation",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return slides.length - 1;
      if (nextIndex >= slides.length) return 0;
      return nextIndex;
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3C5D]/95 via-[#0B3C5D]/80 to-[#0B3C5D]/30"></div>
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-4"
                >
                  <span className="inline-block bg-[#1ABC9C]/20 backdrop-blur-sm text-[#1ABC9C] px-4 py-2 rounded-full text-sm border border-[#1ABC9C]/30">
                    {slides[currentIndex].subtitle}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
                >
                  {slides[currentIndex].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-base sm:text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
                >
                  {slides[currentIndex].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    to={
                      slides[currentIndex].ctaLink ||
                      "/services/website-development"
                    }
                    className="inline-flex items-center justify-center bg-white text-[#0B3C5D] px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 group"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-[#0B3C5D] transition-all duration-300"
                  >
                    Get a Quote
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-12"
                : "bg-white/40 hover:bg-white/60 w-8"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
