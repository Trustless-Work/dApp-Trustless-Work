export interface TabsEscrowStore {
  activeTab: "issuer" | "client" | "serviceProvider" | "disputeResolver";
  setActiveTab: (
    value: "issuer" | "client" | "serviceProvider" | "disputeResolver",
  ) => void;
}
