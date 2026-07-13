"use client";

import { Building2, Copy, Key, Wallet } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect your wallet",
    description: "Sign in with your Stellar wallet to access the dApp.",
  },
  {
    icon: Building2,
    title: "Select an organization",
    description: "API keys are scoped to the active organization.",
  },
  {
    icon: Key,
    title: "Open API Keys",
    description: "Go to Integrations → API Keys and create a key.",
  },
  {
    icon: Copy,
    title: "Copy once",
    description: "Store the secret server-side and send it as x-api-key.",
  },
] as const;

export const ApiKeyVideoFallback = () => {
  return (
    <div className="flex h-full min-h-[240px] w-full flex-col justify-center gap-4 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:min-h-[320px] sm:p-8">
      <p className="text-center text-sm font-medium text-muted-foreground">
        How to create your API key
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/60 p-4 backdrop-blur-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </div>
              <div className="min-w-0 space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
