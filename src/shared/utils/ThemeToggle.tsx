"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useGlobalUIBoundedStore } from "@/store/ui";
import { Button } from "@/ui/button";

const ThemeToggle = () => {
  const theme = useGlobalUIBoundedStore((state) => state.theme);
  const toggleTheme = useGlobalUIBoundedStore((state) => state.toggleTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-full border-0"
      onClick={() => toggleTheme()}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

export default ThemeToggle;
