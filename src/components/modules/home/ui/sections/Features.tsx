"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { useTranslation } from "react-i18next";
import FeatureShowcase from "../cards/FeaturesVideos";

export const FeaturesSection = () => {
  const { t } = useTranslation("common");
  return (
    <Bounded center={true} className="py-20 relative">
      <div className="absolute inset-0 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto text-center relative z-10"
      >
        <FeatureShowcase />
      </motion.div>
    </Bounded>
  );
};
