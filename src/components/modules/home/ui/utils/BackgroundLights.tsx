"use client";

import { motion } from "framer-motion";

export const BackgroundLights = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[100px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-400/10 dark:bg-purple-500/10 blur-[80px]"
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 5,
        }}
      />
    </div>
  );
};
