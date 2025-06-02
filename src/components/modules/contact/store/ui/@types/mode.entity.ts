export interface ModeContactStore {
  activeMode: "table" | "cards";
  setActiveMode: (value: "table" | "cards") => void;
}
