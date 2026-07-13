"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Key,
  Play,
  Wallet,
  Copy,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ApiKeyVideoFallback } from "./ApiKeyVideoFallback";
import { useMounted } from "@/hooks/useMounted";

const STEP_COLOR = "bg-blue-500/10 border-blue-500/20 text-blue-600";

const steps = [
  {
    icon: Wallet,
    title: "Connect your wallet",
    description:
      "Sign in to the dApp with your Stellar wallet (SEP-10). New wallets register with name and email.",
  },
  {
    icon: Building2,
    title: "Select an organization",
    description:
      "Choose or create an organization in the team switcher. API keys are scoped to the active organization.",
  },
  {
    icon: Key,
    title: "Open API Keys",
    description:
      "Go to Integrations → API Keys in the sidebar and create a key for your backend.",
  },
  {
    icon: Copy,
    title: "Copy and store securely",
    description:
      "The secret is shown once. Use it server-side as the x-api-key header against mainnet or testnet API URLs.",
  },
] as const;

export const ApiKeySection = () => {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoThemeKey = isDark ? "dark" : "light";

  return (
    <section className="py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>

      <div className="w-full mx-auto relative z-10">
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
            Generate organization-scoped API keys in the dApp and authenticate
            your backend with Trustless Work using the{" "}
            <code className="text-sm">x-api-key</code> header.
          </p>
        </div>

        <div className="grid lg:grid-cols-10 gap-8 lg:gap-12 items-start">
          <div className="relative lg:col-span-7">
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="w-5 h-5 text-primary" />
                  How to create an API key in the dApp
                </CardTitle>
                <CardDescription>
                  Walk through wallet sign-in, organization selection, and key
                  generation
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

          <div className="space-y-6 lg:col-span-3">
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  API Key for Authentication
                </CardTitle>
                <CardDescription>
                  Self-serve keys for your organization. Store them in your
                  backend — never in the browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-1 gap-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    asChild
                  >
                    <Link
                      href="/dashboard/api-keys"
                      className="inline-flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Open API Keys
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  How to Create Your API Key
                </CardTitle>
                <CardDescription>
                  Follow these steps to generate a key for your integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="relative">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${STEP_COLOR}`}
                          >
                            {index + 1}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-2 rounded-lg ${STEP_COLOR}`}>
                                <Icon className="w-5 h-5" />
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

                        {index < steps.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
