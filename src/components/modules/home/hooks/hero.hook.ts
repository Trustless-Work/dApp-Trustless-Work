import { useEffect, useState } from "react";

export const useHero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Configurable.", "Scalable.", "Transparent."];

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
