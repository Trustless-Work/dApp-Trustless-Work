"use client";

import { motion } from "framer-motion";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

interface ServiceCardProps {
  title: string;
  description: string;
  delay?: number;
}

export const ServiceCard = ({
  title,
  description,
  delay = 0,
}: ServiceCardProps) => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-background/80 dark:bg-background/40 backdrop-blur-md rounded-xl p-6 border border-border shadow-md"
    >
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};
