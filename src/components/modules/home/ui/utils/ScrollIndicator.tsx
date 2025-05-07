"use client";

import { motion } from "framer-motion";

export const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      animate={{
        y: [0, 10, 0],
        opacity: [0.3, 1, 0.3],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <div className="w-6 h-10 rounded-full border-2 border-primary flex justify-center pt-2">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};
