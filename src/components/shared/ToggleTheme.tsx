"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const TOGGLE_CLASSNAME =
  "flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent";

export const ToggleTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !resolvedTheme) {
    return <div className={TOGGLE_CLASSNAME} aria-hidden />;
  }

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme as "light" | "dark"}
      onThemeChange={setTheme}
      className={TOGGLE_CLASSNAME}
    />
  );
};
