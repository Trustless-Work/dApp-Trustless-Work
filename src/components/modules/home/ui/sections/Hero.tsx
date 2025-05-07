"use client";

import { motion, AnimatePresence, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bounded } from "@/components/layout/Bounded";
import Link from "next/link";
import { ScrollIndicator } from "../utils/ScrollIndicator";
import { useHero } from "../../hooks/hero.hook";

interface HeroSectionProps {
  y1: MotionValue<number>;
  opacity: MotionValue<number>;
}

export const HeroSection = ({ y1, opacity }: HeroSectionProps) => {
  const { currentWord, words } = useHero();

  return (
    <Bounded
      center={true}
      className="min-h-[90vh] flex flex-col justify-center relative"
    >
      <motion.div style={{ y: y1, opacity }} className="z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-black/80 dark:text-white/80">Welcome to</span>{" "}
            <br />
            <span className="font-black">Trustless Work</span>
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-xl md:text-2xl mb-4">
            <span className="font-bold text-primary/70 dark:text-primary/80">
              Escrow-as-a-service
            </span>{" "}
            platform designed to secure transactions with transparency,
            efficiency, and scalability.
          </p>

          <div className="h-16 overflow-hidden my-6 relative">
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-primary/70 dark:text-primary/80 absolute"
              >
                {words[currentWord]}
              </motion.h3>
            </AnimatePresence>
          </div>

          <p className="mb-8 text-foreground/80 dark:text-foreground/90">
            <strong>
              Whether you are a developer looking to integrate
              blockchain-powered escrows, a platform aiming to build user trust,
              or an innovator seeking new financial solutions, you're in the
              right place.
            </strong>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="https://docs.trustlesswork.com/trustless-work">
              <Button size="lg" className="group">
                Explore Our Solutions
                <motion.span
                  className="inline-block ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Button>
            </Link>

            <Link href="https://www.trustlesswork.com">
              <Button size="lg" variant="outline" className="group">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </Bounded>
  );
};
