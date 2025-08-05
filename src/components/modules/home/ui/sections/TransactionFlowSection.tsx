"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  ArrowDown,
  ArrowRight,
  Database,
  Send,
  FileText,
  Shield,
  CheckCircle,
} from "lucide-react";

export const TransactionFlowSection = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const { t } = useLanguage();

  const flowSteps = [
    {
      id: 1,
      title: t("home.flow.step1.title"),
      description: t("home.flow.step1.description"),
      icon: FileText,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 2,
      title: t("home.flow.step2.title"),
      description: t("home.flow.step2.description"),
      icon: Database,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 3,
      title: t("home.flow.step3.title"),
      description: t("home.flow.step3.description"),
      icon: Code,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 4,
      title: t("home.flow.step4.title"),
      description: t("home.flow.step4.description"),
      icon: Shield,
      badge: "dApp - wallet / passkey",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 5,
      title: t("home.flow.step5.title"),
      description: t("home.flow.step5.description"),
      icon: Send,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
  ];

  return (
    <Bounded center={true} className="py-20 relative">
      <div className="absolute inset-0 z-0"></div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 50 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <motion.h2
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {t("home.flow.title")}
            </motion.h2>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            {t("home.flow.subtitle")}
          </motion.p>
        </div>

        {/* Flow Diagram */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                {t("home.flow.diagram.title")}
              </CardTitle>
              <CardDescription>
                {t("home.flow.diagram.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"></div>

                <div className="space-y-8">
                  {flowSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                      whileInView={
                        shouldReduceMotion ? {} : { opacity: 1, x: 0 }
                      }
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="relative"
                    >
                      {/* Step Card */}
                      <div className="relative">
                        {/* Connection Dot */}
                        <div className="absolute left-6 top-6 w-3 h-3 bg-primary rounded-full border-2 border-background transform -translate-x-1/2 z-10"></div>

                        <div
                          className={`ml-12 p-6 rounded-xl border ${step.color} shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Step Number */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="text-lg font-bold text-primary">
                                  {step.id}
                                </span>
                              </div>
                            </div>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-primary/5">
                                  <step.icon
                                    className={`w-5 h-5 ${step.iconColor}`}
                                  />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">
                                  {step.title}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-medium"
                                >
                                  {step.badge}
                                </Badge>
                              </div>
                              <p className="text-base text-muted-foreground leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {t("home.flow.summary.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("home.flow.summary.description")}
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Bounded>
  );
};
