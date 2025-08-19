import { StateCreator } from "zustand";

export type ThemeGlobalUIStore = {
  theme: "light" | "dark";
  toggleTheme: (newTheme?: "light" | "dark") => void;
};

export const themeSlice: StateCreator<
  ThemeGlobalUIStore,
  [["zustand/devtools", never]],
  [],
  ThemeGlobalUIStore
> = (set, get) => {
  return {
    // Stores
    theme: "light",

    // Modifiers
    toggleTheme: (newTheme?: "light" | "dark") => {
      const currentTheme = get().theme;
      const themeToSet =
        newTheme || (currentTheme === "light" ? "dark" : "light");
      set({ theme: themeToSet });
    },
  };
};
