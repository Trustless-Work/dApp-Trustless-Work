import { StateCreator } from "zustand";
import { LoadersSettingStore } from "../@types/loaders.entity";

export const useSettingLoadersSlice: StateCreator<
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
