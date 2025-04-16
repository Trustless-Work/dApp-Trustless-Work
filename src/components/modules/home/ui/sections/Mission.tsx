"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe } from "lucide-react";
import { Bounded } from "@/components/layout/Bounded";
import { FeatureCard } from "../cards/FeatureCard";

export const MissionSection = () => {
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
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-xl leading-relaxed mb-12">
          To solve trust in global payments by providing configurable, scalable,
          and transparent escrow infrastructure and tools for the new economy.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Configurable"
            description="Tailor escrow workflows to your unique needs, from milestones to multi-party agreements."
            delay={0}
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Scalable"
            description="Support high transaction volumes and diverse industries, enabling seamless growth."
            delay={0.2}
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-primary" />}
            title="Transparent"
            description="Leverage blockchain technology to ensure visibility and fairness in every transaction."
            delay={0.4}
          />
        </div>
      </motion.div>
    </Bounded>
  );
};
