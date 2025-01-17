export interface ViewModeEscrowStore {
  activeMode: "table" | "cards";
  setActiveMode: (value: "table" | "cards") => void;
}
