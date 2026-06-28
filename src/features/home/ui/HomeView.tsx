"use client";

import dynamic from "next/dynamic";
import HeaderWithoutAuth from "@/components/shared/HeaderWithoutAuth";
import { useHome } from "../hooks/useHome";
import { BackgroundLights } from "./BackgroundLights";
import { HeroSection } from "./Hero";
import { Footer } from "@/components/shared/Footer";

const RolesSection = dynamic(() =>
  import("./RolesSection").then((mod) => ({
    default: mod.RolesSection,
  })),
);

const ApiKeySection = dynamic(() =>
  import("./ApiKeySection").then((mod) => ({
    default: mod.ApiKeySection,
  })),
);

const IntegrationSetupSection = dynamic(() =>
  import("./IntegrationSetupSection").then((mod) => ({
    default: mod.IntegrationSetupSection,
  })),
);

const TransactionFlowSection = dynamic(() =>
  import("./TransactionFlowSection").then((mod) => ({
    default: mod.TransactionFlowSection,
  })),
);

export const HomeView = () => {
  const homeHook = useHome();
  const containerRef = homeHook?.containerRef ?? null;

  return (
    <div className="overflow-x-clip">
      <BackgroundLights />

      <div className="container mx-auto">
        <HeaderWithoutAuth />

        <main
          className="flex flex-col px-2 flex-1 overflow-hidden w-full"
          ref={containerRef}
        >
          <HeroSection />
          <ApiKeySection />
          <RolesSection />
          <IntegrationSetupSection />
          <TransactionFlowSection />
        </main>
      </div>

      <Footer />
    </div>
  );
};
