"use client";

import { Code } from "lucide-react";
import { IntegrationAuthenticationCard } from "@/features/home/ui/IntegrationAuthenticationCard";
import { IntegrationCodeExamplesCard } from "@/features/home/ui/IntegrationCodeExamplesCard";
import { IntegrationDocsCtaCards } from "@/features/home/ui/IntegrationDocsCtaCards";
import { IntegrationExampleEndpointCard } from "@/features/home/ui/IntegrationExampleEndpointCard";

export const IntegrationSetupSection = () => (
  <section className="py-20 relative w-full">
    <div className="absolute inset-0 z-0"></div>

    <div className="w-full mx-auto relative z-10">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Quick Integration Setup
          </h2>
        </div>

        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
          Get started with Trustless Work API in minutes. Learn how to
          authenticate and make your first API call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        <div className="space-y-6">
          <IntegrationAuthenticationCard />
          <IntegrationExampleEndpointCard />
        </div>

        <div className="space-y-6">
          <IntegrationCodeExamplesCard />
          <IntegrationDocsCtaCards />
        </div>
      </div>
    </div>
  </section>
);
