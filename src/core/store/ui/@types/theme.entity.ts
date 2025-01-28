export interface ThemeGlobalUIStore {
  theme: "light" | "dark";
  toggleTheme: (newTheme?: "light" | "dark") => void;
}
