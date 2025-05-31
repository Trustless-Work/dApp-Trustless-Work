"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { ServiceCard } from "../cards/ServiceCard";
import { useTranslation } from "react-i18next";

export const HowItWorksSection = () => {
  const { t } = useTranslation("common");
  return (
    <Bounded center={true} className="py-20 relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 112, 243, 0.08), transparent 70%)",
        }}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t("home.howItWorks.title")}
        </h2>
        <p className="text-xl max-w-3xl mx-auto mb-12">
          {t("home.howItWorks.subtitle")}
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard
            title={t("home.howItWorks.services.escrowService.title")}
            description={t(
              "home.howItWorks.services.escrowService.description",
            )}
            delay={0.1}
          />

          <ServiceCard
            title={t("home.howItWorks.services.developerTools.title")}
            description={t(
              "home.howItWorks.services.developerTools.description",
            )}
            delay={0.3}
          />

          <ServiceCard
            title={t("home.howItWorks.services.applications.title")}
            description={t("home.howItWorks.services.applications.description")}
            delay={0.5}
          />
        </div>
      </motion.div>
    </Bounded>
  );
};
