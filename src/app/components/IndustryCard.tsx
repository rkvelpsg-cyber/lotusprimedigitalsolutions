import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface IndustryCardProps {
  icon: LucideIcon;
  name: string;
  index: number;
}

export function IndustryCard({ icon: Icon, name, index }: IndustryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-[#1ABC9C]/30 group cursor-pointer"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-[#0B3C5D]/10 to-[#1ABC9C]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-[#0B3C5D] group-hover:to-[#1ABC9C] transition-all duration-300">
        <Icon className="w-8 h-8 text-[#0B3C5D] group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-sm text-[#0B3C5D] group-hover:text-[#1ABC9C] transition-colors">
        {name}
      </h3>
    </motion.div>
  );
}
