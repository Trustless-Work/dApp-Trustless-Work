export interface FiltersContactStore {
  filters: {
    name: string;
    email: string;
    walletType: string | null;
  };
  setFilters: (filters: Partial<FiltersContactStore["filters"]>) => void;
}
