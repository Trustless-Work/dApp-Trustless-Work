export interface LoadersContactStore {
  isCreatingContact: boolean;
  isEditingContact: boolean;
  setIsCreatingContact: (value: boolean) => void;
  setIsEditingContact: (value: boolean) => void;
}
