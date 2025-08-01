"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { SmartEscrowCard } from "../cards/SmartEscrowCard";
import { useTranslation } from "react-i18next";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const SmartEscrowSection = () => {
  const { t } = useTranslation("common");
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <Bounded className="py-20 relative">
      <div className="absolute inset-0 bg-muted/50 dark:bg-muted/20 backdrop-blur-sm z-0"></div>

      <div className="grid grid-cols-1 xl:grid-cols-[55%_1fr] gap-12 items-center relative z-10">
        <SmartEscrowCard />

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 50 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="order-1 md:order-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("home.smartEscrow.title")}
          </h2>
          <p className="text-lg mb-6">{t("home.smartEscrow.description1")}</p>
          <p className="text-lg mb-6">{t("home.smartEscrow.description2")}</p>
          <p className="text-lg font-medium">
            {t("home.smartEscrow.description3")}
          </p>
        </motion.div>
      </div>
    </Bounded>
  );
};
