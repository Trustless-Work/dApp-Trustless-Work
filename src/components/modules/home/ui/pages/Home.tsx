import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import { useHome } from "../../hooks/home.hook";
import { Bounded } from "@/components/layout/Bounded";
import { BackgroundLights } from "../utils/BackgroundLights";
import { HeroSection } from "../sections/Hero";
import { MissionSection } from "../sections/Features";
import { HowItWorksSection } from "../sections/HowItWorks";
import { CTASection } from "../sections/CTA";
import { WhyEscrowsSection } from "../sections/WhyEscrows";
import { SmartEscrowSection } from "../sections/SmartEscrow";
import { MotionValue } from "framer-motion";
import { ConnectArrow } from "../utils/ConnectArrow";

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
          <MissionSection />
          <WhyEscrowsSection />
          <HowItWorksSection />
          <SmartEscrowSection />
          <CTASection />
        </main>
      </Bounded>
    </>
  );
};
