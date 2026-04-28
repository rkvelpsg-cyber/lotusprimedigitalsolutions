import { Link } from "react-router";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  index: number;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  link,
  index,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        to={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group h-full"
      >
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 h-60 border border-gray-100 hover:border-[#1ABC9C]/30 flex flex-col">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] rounded-xl flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base text-[#0B3C5D] mb-1 flex-shrink-0 group-hover:text-[#1ABC9C] transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-600 flex-1 overflow-hidden">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
