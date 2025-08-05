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
import {
  Users,
  CheckCircle,
  UserCheck,
  Unlock,
  Shield,
  Building2,
  User,
  ArrowRight,
  Zap,
} from "lucide-react";

export const RolesSection = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const { t } = useLanguage();

  const roles = [
    {
      id: "approver",
      icon: <CheckCircle className="w-6 h-6" />,
      title: t("home.roles.approver.title"),
      description: t("home.roles.approver.description"),
      examples: t("home.roles.approver.examples", { returnObjects: true }),
      color: "bg-green-500/10 border-green-500/20 text-green-600",
      gradient: "from-green-500/20 to-green-600/20",
    },
    {
      id: "serviceProvider",
      icon: <UserCheck className="w-6 h-6" />,
      title: t("home.roles.serviceProvider.title"),
      description: t("home.roles.serviceProvider.description"),
      examples: t("home.roles.serviceProvider.examples", {
        returnObjects: true,
      }),
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "releaseSigner",
      icon: <Unlock className="w-6 h-6" />,
      title: t("home.roles.releaseSigner.title"),
      description: t("home.roles.releaseSigner.description"),
      examples: t("home.roles.releaseSigner.examples", { returnObjects: true }),
      color: "bg-purple-500/10 border-purple-500/20 text-purple-600",
      gradient: "from-purple-500/20 to-purple-600/20",
    },
    {
      id: "disputeResolver",
      icon: <Shield className="w-6 h-6" />,
      title: t("home.roles.disputeResolver.title"),
      description: t("home.roles.disputeResolver.description"),
      examples: t("home.roles.disputeResolver.examples", {
        returnObjects: true,
      }),
      color: "bg-orange-500/10 border-orange-500/20 text-orange-600",
      gradient: "from-orange-500/20 to-orange-600/20",
    },
    {
      id: "platformAddress",
      icon: <Building2 className="w-6 h-6" />,
      title: t("home.roles.platformAddress.title"),
      description: t("home.roles.platformAddress.description"),
      examples: t("home.roles.platformAddress.examples", {
        returnObjects: true,
      }),
      color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
      gradient: "from-indigo-500/20 to-indigo-600/20",
    },
    {
      id: "receiver",
      icon: <User className="w-6 h-6" />,
      title: t("home.roles.receiver.title"),
      description: t("home.roles.receiver.description"),
      examples: t("home.roles.receiver.examples", { returnObjects: true }),
      color: "bg-pink-500/10 border-pink-500/20 text-pink-600",
      gradient: "from-pink-500/20 to-pink-600/20",
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
              <Users className="w-6 h-6 text-primary" />
            </div>
            <motion.h2
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {t("home.roles.title")}
            </motion.h2>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            {t("home.roles.subtitle")}
          </motion.p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <Card className="h-full border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-3 rounded-xl ${role.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">
                        {role.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {t("home.roles.examples.title")}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {Array.isArray(role.examples) ? (
                        role.examples.map(
                          (example: string | object, exampleIndex: number) => (
                            <motion.div
                              key={exampleIndex}
                              initial={
                                shouldReduceMotion ? {} : { opacity: 0, x: 10 }
                              }
                              whileInView={
                                shouldReduceMotion ? {} : { opacity: 1, x: 0 }
                              }
                              transition={{
                                duration: 0.4,
                                delay: 0.7 + index * 0.1 + exampleIndex * 0.05,
                              }}
                              viewport={{ once: true, amount: 0.3 }}
                              className="flex items-start gap-2"
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${role.color.replace("bg-", "bg-").replace("/10", "/30")}`}
                              />
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {typeof example === "string"
                                  ? example
                                  : String(example)}
                              </span>
                            </motion.div>
                          ),
                        )
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          No examples available
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-12"
        >
          <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {t("home.roles.cta.title")}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {t("home.roles.cta.description")}
              </p>
              <a
                href="https://docs.trustlesswork.com/trustless-work/technology-overview/roles-in-trustless-work"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                {t("home.roles.cta.link")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Bounded>
  );
};
