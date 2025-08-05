"use client";

import { motion } from "framer-motion";
import { Bounded } from "@/components/layout/Bounded";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";
import { useLanguage } from "@/hooks/useLanguage";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ExternalLink,
  Key,
  Play,
  AlertCircle,
  Wallet,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export const ApiKeySection = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const { t } = useLanguage();
  const theme = useGlobalUIBoundedStore((state) => state.theme);
  const [, setIsVideoPlaying] = useState(false);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const steps = [
    {
      icon: <Wallet className="w-5 h-5" />,
      title: t("apiKey.steps.connect.title"),
      description: t("apiKey.steps.connect.description"),
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: t("apiKey.steps.settings.title"),
      description: t("apiKey.steps.settings.description"),
      color: "bg-green-500/10 border-green-500/20 text-green-600",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: t("apiKey.steps.profile.title"),
      description: t("apiKey.steps.profile.description"),
      color: "bg-purple-500/10 border-purple-500/20 text-purple-600",
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: t("apiKey.steps.request.title"),
      description: t("apiKey.steps.request.description"),
      color: "bg-orange-500/10 border-orange-500/20 text-orange-600",
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
              <Key className="w-6 h-6 text-primary" />
            </div>
            <motion.h2
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {t("apiKey.title")}
            </motion.h2>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("apiKey.subtitle")}
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-10 gap-8 lg:gap-12 items-start">
          {/* Video Section */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative lg:col-span-7"
          >
            <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="w-5 h-5 text-primary" />
                  {t("apiKey.video.title")}
                </CardTitle>
                <CardDescription>
                  {t("apiKey.video.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                  >
                    <source
                      src={`/videos/request-api-key-${theme === "dark" ? "dark" : "light"}.mp4`}
                      type="video/mp4"
                    />
                  </video>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Key Information */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6 lg:col-span-3"
          >
            {/* Main API Key Card */}
            <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  {t("apiKey.title")}
                </CardTitle>
                <CardDescription>{t("apiKey.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        {t("apiKey.info.title")}
                      </p>
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t("apiKey.info.testnet"),
                        }}
                      />
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: t("apiKey.info.mainnet"),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    asChild
                  >
                    <Link
                      href="https://dapp.dev.trustlesswork.com/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      {t("apiKey.buttons.testnet")}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-primary/20 hover:bg-primary/5"
                    asChild
                  >
                    <Link
                      href="https://dapp.trustlesswork.com/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      {t("apiKey.buttons.mainnet")}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Steps Diagram */}
            <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("apiKey.steps.title")}
                </CardTitle>
                <CardDescription>{t("apiKey.steps.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                      whileInView={
                        shouldReduceMotion ? {} : { opacity: 1, x: 0 }
                      }
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      className="relative"
                    >
                      <div className="flex items-start gap-4">
                        {/* Step Number */}
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step.color}`}
                        >
                          {index + 1}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-2 rounded-lg ${step.color}`}>
                              {step.icon}
                            </div>
                            <h4 className="font-semibold text-foreground">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Arrow connector (except for last step) */}
                      {index < steps.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Bounded>
  );
};
