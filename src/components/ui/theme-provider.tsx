"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={
        typeof window === "undefined" ? undefined : { type: "application/json" }
      }
    >
      {children}
    </NextThemesProvider>
  );
}
