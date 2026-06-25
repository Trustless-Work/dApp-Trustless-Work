"use client";

import FeatureShowcase from "./FeaturesVideos";

export const FeaturesSection = () => {
  return (
    <section className="py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>
      <div className="w-full mx-auto text-center relative z-10">
        <FeatureShowcase />
        <p className="text-sm text-muted-foreground mt-5 italic text-end">
          <span className="font-extrabold text-lg mr-1">"</span>Traditional
          trusts rely on blind faith; blockchain replaces it with transparency
          and automation. That's how{" "}
          <span className="text-primary font-bold">Trustless Work</span>{" "}
          operates.
          <span className="font-extrabold text-lg">"</span>
        </p>
      </div>
    </section>
  );
};
