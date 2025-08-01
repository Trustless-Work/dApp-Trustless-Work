"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

export const CTASection = () => {
  const { t } = useTranslation("common");
  const shouldReduceMotion = useShouldReduceMotion();

  return (
    <Bounded className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 backdrop-blur-sm z-0"></div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 50 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {t("home.cta.title")}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("home.cta.description")}
        </p>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="group">
              {t("home.cta.getStartedButton")}
              <motion.span
                className="inline-block ml-2"
                initial={{ x: 0 }}
                whileHover={shouldReduceMotion ? {} : { x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Button>
          </Link>

          <Link href="https://docs.trustlesswork.com">
            <Button size="lg" variant="outline">
              {t("home.cta.learnMoreButton")}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </Bounded>
  );
};
