import dynamic from "next/dynamic";
import HeaderWithoutAuth from "@/components/layout/header/HeaderWithoutAuth";
import { useHome } from "../../hooks/home.hook";
import { BackgroundLights } from "../utils/BackgroundLights";
import { HeroSection } from "../sections/Hero";
import { MotionValue } from "framer-motion";
import Footer from "@/components/layout/footer/Footer";

// Lazy load sections pesadas
const FeaturesSection = dynamic(() =>
  import("../sections/Features").then((mod) => ({
    default: mod.FeaturesSection,
  })),
);

const RolesSection = dynamic(() =>
  import("../sections/RolesSection").then((mod) => ({
    default: mod.RolesSection,
  })),
);

const ApiKeySection = dynamic(() =>
  import("../sections/ApiKeySection").then((mod) => ({
    default: mod.ApiKeySection,
  })),
);

const IntegrationSetupSection = dynamic(() =>
  import("../sections/IntegrationSetupSection").then((mod) => ({
    default: mod.IntegrationSetupSection,
  })),
);

export const Home = () => {
  const homeHook = useHome();
  const containerRef = homeHook?.containerRef ?? null;
  const y1 = homeHook?.y1 as MotionValue<number>;
  const opacity = homeHook?.opacity as MotionValue<number>;

  return (
    <>
      <BackgroundLights />

      <div className="container mx-auto">
        <HeaderWithoutAuth />

        <main className="overflow-hidden" ref={containerRef}>
          <HeroSection y1={y1} opacity={opacity} />
          <FeaturesSection />
          <RolesSection />
          <ApiKeySection />
          <IntegrationSetupSection />
          <Footer />
        </main>
      </div>
    </>
  );
};
