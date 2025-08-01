"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import FeatureShowcase from "../cards/FeaturesVideos";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const FeaturesSection = () => {
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <Bounded center={true} className="py-20 relative">
      <div className="absolute inset-0 z-0"></div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 50 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto text-center relative z-10"
      >
        <FeatureShowcase />
        <p className="text-sm text-muted-foreground mt-5 italic text-end">
          <span className="font-extrabold text-lg mr-1">"</span>Traditional
          trusts rely on blind faith; blockchain replaces it with transparency
          and automation. That's how{" "}
          <span className="text-primary-500 font-bold">Trustless Work</span>{" "}
          operates.
          <span className="font-extrabold text-lg">"</span>
        </p>
      </motion.div>
    </Bounded>
  );
};
