import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export const ToggleTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return null;

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme as "light" | "dark"}
      onThemeChange={setTheme}
      className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
    />
  );
};
