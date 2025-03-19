export interface ViewModeContactStore {
  activeMode: "table" | "cards";
  setActiveMode: (value: "table" | "cards") => void;
}
