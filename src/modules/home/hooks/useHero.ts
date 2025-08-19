import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useHero = () => {
  const { t } = useTranslation("common");
  const [currentWord, setCurrentWord] = useState(0);
  const words = [
    t("home.hero.currentWords.configurable"),
    t("home.hero.currentWords.scalable"),
    t("home.hero.currentWords.transparent"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return {
    currentWord,
    words,
  };
};
