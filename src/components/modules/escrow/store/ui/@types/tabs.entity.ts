export interface TabsEscrowStore {
  activeTab: "user" | "serviceProvider" | "disputeResolver";
  setActiveTab: (value: "user" | "serviceProvider" | "disputeResolver") => void;
}
