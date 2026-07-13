import {
  SwkAppDarkTheme,
  SwkAppLightTheme,
  type SwkAppTheme,
} from "@creit-tech/stellar-wallets-kit/types";

const TRUSTLESS_PRIMARY = "#006be4";
const TRUSTLESS_PRIMARY_FOREGROUND = "#ffffff";
const TRUSTLESS_BORDER_RADIUS = "0.625rem";
const TRUSTLESS_FONT_FAMILY =
  '"Space Grotesk", ui-sans-serif, system-ui, sans-serif';

export function isAppDarkMode(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

export function resolveWalletKitTheme(isDark = isAppDarkMode()): SwkAppTheme {
  if (isDark) {
    return {
      ...SwkAppDarkTheme,
      background: "oklch(0.205 0 0)",
      "background-secondary": "oklch(0.145 0 0)",
      "foreground-strong": "oklch(0.985 0 0)",
      foreground: "oklch(0.985 0 0)",
      "foreground-secondary": "oklch(0.708 0 0)",
      primary: TRUSTLESS_PRIMARY,
      "primary-foreground": TRUSTLESS_PRIMARY_FOREGROUND,
      lighter: "oklch(0.269 0 0)",
      light: "oklch(0.269 0 0)",
      danger: "oklch(0.704 0.191 22.216)",
      border: "rgba(255, 255, 255, 0.1)",
      "border-radius": TRUSTLESS_BORDER_RADIUS,
      "font-family": TRUSTLESS_FONT_FAMILY,
    };
  }

  return {
    ...SwkAppLightTheme,
    background: "oklch(1 0 0)",
    "background-secondary": "oklch(0.97 0 0)",
    "foreground-strong": "oklch(0.145 0 0)",
    foreground: "oklch(0.145 0 0)",
    "foreground-secondary": "oklch(0.556 0 0)",
    primary: TRUSTLESS_PRIMARY,
    "primary-foreground": TRUSTLESS_PRIMARY_FOREGROUND,
    lighter: "oklch(0.97 0 0)",
    light: "oklch(0.97 0 0)",
    danger: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.922 0 0)",
    "border-radius": TRUSTLESS_BORDER_RADIUS,
    "font-family": TRUSTLESS_FONT_FAMILY,
  };
}
