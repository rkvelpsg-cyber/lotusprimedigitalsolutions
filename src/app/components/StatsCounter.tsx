import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface StatsCounterProps {
  end: number;
  label: string;
  suffix?: string;
}

export function StatsCounter({ end, label, suffix = "" }: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center bg-white rounded-2xl p-8 shadow-lg"
    >
      <div className="text-4xl md:text-5xl text-[#0B3C5D] mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-lg text-gray-600">{label}</div>
    </motion.div>
  );
}
