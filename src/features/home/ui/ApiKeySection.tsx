"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Key, Play, Wallet, Settings, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ApiKeyVideoFallback } from "./ApiKeyVideoFallback";
import { useMounted } from "@/hooks/useMounted";

export const ApiKeySection = () => {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoThemeKey = isDark ? "dark" : "light";

  const steps = [
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Connect your wallet",
      description: "Enter our backoffice using your wallet.",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Go to Settings",
      description: "Navigate to the Settings section in the sidebar",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Configure Your Profile",
      description:
        "Set up your profile - the use case field is mandatory for requesting your API key",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: "Request API Key",
      description:
        "Go to the API Keys option in the sidebar and request your key based on your desired network.",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    },
  ];

  return (
    <section className="py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>

      <div className="w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              API Key for Authentication
            </h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get access to the Trustless Work API to integrate escrow
            functionality into your application
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-10 gap-8 lg:gap-12 items-start">
          {/* Video Section */}
          <div className="relative lg:col-span-7">
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="w-5 h-5 text-primary" />
                  How to Request API Key in the backoffice
                </CardTitle>
                <CardDescription>
                  See how to request your API Key step by step in the backoffice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  {hasVideoError ? (
                    <ApiKeyVideoFallback />
                  ) : (
                    <video
                      key={videoThemeKey}
                      className="w-full h-full object-cover"
                      controls
                      onError={() => setHasVideoError(true)}
                    >
                      <source
                        key={isDark ? "dark" : "light"}
                        src={`/videos/request-api-key-${isDark ? "dark" : "light"}.mp4`}
                        type="video/mp4"
                      />
                    </video>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Key Information */}
          <div className="space-y-6 lg:col-span-3">
            {/* Main API Key Card */}
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  API Key for Authentication
                </CardTitle>
                <CardDescription>
                  Get access to the Trustless Work API to integrate escrow
                  functionality into your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-1 gap-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    asChild
                  >
                    <Link
                      href="https://dapp.trustlesswork.com/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      API Key
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Steps Diagram */}
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  How to Request Your API Key
                </CardTitle>
                <CardDescription>
                  Follow these simple steps to get your API key
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="relative">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
