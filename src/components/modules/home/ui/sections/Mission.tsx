"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe } from "lucide-react";
import { Bounded } from "@/components/layout/Bounded";
import { FeatureCard } from "../cards/FeatureCard";
import { useTranslation } from "react-i18next";

export const MissionSection = () => {
  const { t } = useTranslation("common");
  return (
    <Bounded center={true} className="py-20 relative">
      <div className="absolute inset-0 bg-background/50 dark:bg-background/30 backdrop-blur-md z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t("home.mission.title")}
        </h2>
        <p className="text-xl leading-relaxed mb-12">
          {t("home.mission.description")}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title={t("home.mission.features.configurable.title")}
            description={t("home.mission.features.configurable.description")}
            delay={0}
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title={t("home.mission.features.scalable.title")}
            description={t("home.mission.features.scalable.description")}
            delay={0.2}
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-primary" />}
            title={t("home.mission.features.transparent.title")}
            description={t("home.mission.features.transparent.description")}
            delay={0.4}
          />
        </div>
      </motion.div>
    </Bounded>
  );
};
