"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundLightsProps {
  className?: string;
}

export const Lights = ({ className }: BackgroundLightsProps) => {
  return (
    <div className={cn("fixed inset-0 z-[-2] pointer-events-none", className)}>
      {/* Light that spans across sidebar and content */}
      <motion.div
        style={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }} // primary: blue-500 aprox
        className="absolute top-[5%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[200px]"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Secondary light */}
      <motion.div
        style={{ backgroundColor: "rgba(96, 165, 250, 0.02)" }} // blue-400
        className="absolute bottom-[10%] left-[5%] w-[700px] h-[700px] rounded-full blur-[180px]"
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 35,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Accent light */}
      <motion.div
        style={{ backgroundColor: "rgba(192, 132, 252, 0.02)" }} // purple-400
        className="absolute top-[40%] left-[15%] w-[600px] h-[600px] rounded-full blur-[160px]"
        animate={{
          x: [0, 20, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 28,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Right-side light */}
      <motion.div
        style={{ backgroundColor: "rgba(52, 211, 153, 0.02)" }} // emerald-400
        className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[150px]"
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 26,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 8,
        }}
      />
    </div>
  );
};
