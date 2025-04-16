"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bounded } from "@/components/layout/Bounded";
import Link from "next/link";

export const CTASection = () => {
  return (
    <Bounded center={true} className="py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl mb-8">
          Join us in building the future of trust in global payments.
        </p>
        <Link
          href="https://docs.trustlesswork.com/trustless-work"
          target="_blank"
        >
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
      </motion.div>
    </Bounded>
  );
};
