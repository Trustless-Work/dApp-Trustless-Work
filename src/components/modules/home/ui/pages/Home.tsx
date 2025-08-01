import dynamic from "next/dynamic";
import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import { useHome } from "../../hooks/home.hook";
import { Bounded } from "@/components/layout/Bounded";
import { BackgroundLights } from "../utils/BackgroundLights";
import { HeroSection } from "../sections/Hero";
import { MotionValue } from "framer-motion";
import { ConnectArrow } from "../utils/ConnectArrow";

// Lazy load sections pesadas
const FeaturesSection = dynamic(() =>
  import("../sections/Features").then((mod) => ({
    default: mod.FeaturesSection,
  })),
);
const HowItWorksSection = dynamic(() =>
  import("../sections/HowItWorks").then((mod) => ({
    default: mod.HowItWorksSection,
  })),
);
const CTASection = dynamic(() =>
  import("../sections/CTA").then((mod) => ({ default: mod.CTASection })),
);
const WhyEscrowsSection = dynamic(() =>
  import("../sections/WhyEscrows").then((mod) => ({
    default: mod.WhyEscrowsSection,
  })),
);
const SmartEscrowSection = dynamic(() =>
  import("../sections/SmartEscrow").then((mod) => ({
    default: mod.SmartEscrowSection,
  })),
);

export const Home = () => {
  const homeHook = useHome();
  const containerRef = homeHook?.containerRef ?? null;
  const y1 = homeHook?.y1 as MotionValue<number>;
  const opacity = homeHook?.opacity as MotionValue<number>;

  return (
    <>
      <HeaderWithoutAuth />
      <ConnectArrow />

      <Bounded center={true} className="mx-2 sm:mx-32">
        <main className="overflow-hidden" ref={containerRef}>
          <BackgroundLights />
          <HeroSection y1={y1} opacity={opacity} />
          <FeaturesSection />
          <WhyEscrowsSection />
          <HowItWorksSection />
          <SmartEscrowSection />
          <CTASection />
        </main>
      </Bounded>
    </>
  );
};
