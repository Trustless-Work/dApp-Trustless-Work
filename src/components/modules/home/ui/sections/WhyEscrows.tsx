"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { ComparisonCard } from "../cards/ComparisonCard";

export const WhyEscrowsSection = () => {
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
            Why Escrows Matter
          </h2>
          <p className="text-lg mb-6">
            At its core, an escrow is a neutral and secure way to hold funds
            while something else happens—whether it's transferring a house,
            delivering a product, or completing a project.
          </p>
          <p className="text-lg mb-6">
            In traditional payment systems, trust is built through costly
            intermediaries, complex processes, and limited transparency. These
            barriers slow innovation, increase costs, and limit accessibility.
          </p>
          <p className="text-lg font-medium">
            Trustless Work eliminates these inefficiencies, fostering trust
            through blockchain-powered automation, API-driven simplicity, and
            global accessibility.
          </p>
        </motion.div>

        <ComparisonCard />
      </div>
    </Bounded>
  );
};
