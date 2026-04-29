"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  company: string;
  text: string;
  rating: number;
  index: number;
  image?: string;
}

export function TestimonialCard({
  name,
  company,
  text,
  rating,
  index,
  image,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-[#1ABC9C]/20" />
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-[#1ABC9C] text-[#1ABC9C]" />
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">{text}</p>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[#0B3C5D]">{name}</div>
          <div className="text-sm text-gray-500">{company}</div>
        </div>
      </div>
    </motion.div>
  );
}
