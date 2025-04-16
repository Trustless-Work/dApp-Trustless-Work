"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { SmartEscrowCard } from "../cards/SmartEscrowCard";

export const SmartEscrowSection = () => {
  return (
    <Bounded className="py-20 relative">
      <div className="absolute inset-0 bg-muted/50 dark:bg-muted/20 backdrop-blur-sm z-0"></div>

      <div className="grid md:grid-cols-[55%_45%] gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -500 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="order-2 md:order-1"
        >
          <SmartEscrowCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="order-1 md:order-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What does a Smart Escrow look like?
          </h2>
          <p className="text-lg mb-6">
            Our smart escrows are designed to be flexible, secure, and
            transparent. Each escrow has unique properties that define how it
            works and who can interact with it.
          </p>
          <p className="text-lg mb-6">
            From the escrow ID to milestones and flags, every aspect is
            carefully designed to ensure trust and efficiency in your
            transactions.
          </p>
          <p className="text-lg font-medium">
            Smart escrows can be configured for various use cases, from simple
            payments to complex multi-stage projects with multiple stakeholders.
          </p>
        </motion.div>
      </div>
    </Bounded>
  );
};
