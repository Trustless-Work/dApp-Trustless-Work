"use client";

import { motion } from "framer-motion";

export const ComparisonCard = () => {
  return (
    <div className="relative">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 dark:bg-primary/10 rounded-full blur-[80px] z-0"></div>

      <motion.div
        className="relative z-10 bg-background/80 dark:bg-background/40 backdrop-blur-md rounded-2xl p-8 border border-border shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-4">
          Traditional Systems vs Trustless Work
        </h3>

        <div className="space-y-6">
          <ComparisonItem
            isNegative={true}
            title="Costly Intermediaries"
            description="Banks, lawyers, or brokers adding fees and delays."
          />

          <ComparisonItem
            isNegative={true}
            title="Complex Processes"
            description="Lengthy, manual procedures that slow down business."
          />

          <ComparisonItem
            isNegative={true}
            title="Limited Transparency"
            description="Little visibility into where funds are and why delays occur."
          />

          <div className="h-px bg-border my-4"></div>

          <ComparisonItem
            isNegative={false}
            title="Our Solution"
            description="Blockchain-powered smart escrows that are configurable, scalable, and transparent."
          />
        </div>
      </motion.div>
    </div>
  );
};

interface ComparisonItemProps {
  isNegative: boolean;
  title: string;
  description: string;
}

const ComparisonItem = ({
  isNegative,
  title,
  description,
}: ComparisonItemProps) => {
  const bgColor = isNegative
    ? "bg-red-100 dark:bg-red-900/30"
    : "bg-green-100 dark:bg-green-900/30";

  const textColor = isNegative
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";

  const symbol = isNegative ? "✕" : "✓";

  return (
    <div className="flex items-start gap-4">
      <div
        className={`min-w-10 h-10 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}
      >
        {symbol}
      </div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-foreground/80">{description}</p>
      </div>
    </div>
  );
};
