import { StateCreator } from "zustand";

export type LoadersSettingStore = {
  isRequestingAPIKey: boolean;
  setIsRequestingAPIKey: (value: boolean) => void;
};

export const settingLoadersSlice: StateCreator<
  LoadersSettingStore,
  [["zustand/devtools", never]],
  [],
  LoadersSettingStore
> = (set) => {
  return {
    // Stores
    isRequestingAPIKey: false,

    // Modifiers
    setIsRequestingAPIKey: (value: boolean) =>
      set({ isRequestingAPIKey: value }),
  };
};
