"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { ComparisonCard } from "../cards/ComparisonCard";
import { useTranslation } from "react-i18next";

export const WhyEscrowsSection = () => {
  const { t } = useTranslation("common");
  return (
    <Bounded className="py-20 relative">
      <div className="absolute inset-0 bg-muted/50 dark:bg-muted/20 backdrop-blur-sm z-0"></div>

      <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("home.whyEscrows.title")}
          </h2>
          <p className="text-lg mb-6">
            {t("home.whyEscrows.description1")}
          </p>
          <p className="text-lg mb-6">
            {t("home.whyEscrows.description2")}
          </p>
          <p className="text-lg font-medium">
            {t("home.whyEscrows.description3")}
          </p>
        </motion.div>

        <ComparisonCard />
      </div>
    </Bounded>
  );
};
