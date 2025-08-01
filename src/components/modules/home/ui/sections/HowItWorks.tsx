"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { ServiceCard } from "../cards/ServiceCard";
import { useTranslation } from "react-i18next";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const HowItWorksSection = () => {
  const { t } = useTranslation("common");
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <Bounded className="py-20 relative">
      <div className="absolute inset-0 bg-muted/20 dark:bg-muted/10 backdrop-blur-sm z-0"></div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 50 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("home.howItWorks.subtitle")}
          </p>
        </div>

        <ServiceCard />
      </motion.div>
    </Bounded>
  );
};
