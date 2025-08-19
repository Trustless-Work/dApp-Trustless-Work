"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/ui/button";
import { Bounded } from "@/shared/Bounded";
import Link from "next/link";
import { useHero } from "../../hooks/useHero";
import { Trans, useTranslation } from "react-i18next";

export const HeroSection = () => {
  const { currentWord, words } = useHero();
  const { t } = useTranslation("common");

  return (
    <Bounded
      center={true}
      className="min-h-[95vh] flex flex-col justify-center relative"
    >
      <div className="z-10 relative">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
            <span className="text-black/80 dark:text-white/80">
              {t("home.hero.welcome")}
            </span>{" "}
            <br />
            <span className="font-black">{t("home.hero.title")}</span>
          </h1>
        </div>

        <div className="max-w-2xl">
          <p className="text-xl md:text-2xl mb-4">
            <Trans
              i18nKey="home.hero.subtitle"
              ns="common"
              components={{
                strong: (
                  <span className="font-bold text-primary/70 dark:text-primary/80" />
                ),
              }}
            />
          </p>

          <div className="h-16 my-6 relative">
            <h3 className="text-3xl md:text-4xl font-bold text-primary/70 dark:text-primary/80">
              {words[currentWord]}
            </h3>
          </div>

          <p className="mb-8 text-foreground/80 dark:text-foreground/90">
            <strong>{t("home.hero.description")}</strong>
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="https://docs.trustlesswork.com/trustless-work">
              <Button size="lg" className="group">
                {t("home.hero.exploreButton")}
                <span className="inline-block ml-2">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </Link>

            <Link href="https://www.trustlesswork.com">
              <Button size="lg" variant="outline" className="group">
                {t("home.hero.learnMoreButton")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Bounded>
  );
};
