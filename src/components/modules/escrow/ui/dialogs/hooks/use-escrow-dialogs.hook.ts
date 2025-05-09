import { useEscrowUIBoundedStore } from "../../../store/ui";

interface DialogStates {
  second: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  qr: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  resolveDispute: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  editMilestone: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  editEntities: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  editBasicProperties: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  completeMilestone: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  successRelease: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
  successResolveDispute: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  };
}

interface StatusStates {
  isChangingStatus: boolean;
  isStartingDispute: boolean;
}

export const useEscrowDialogs = (): DialogStates & StatusStates => {
  const store = useEscrowUIBoundedStore();

  return {
    second: {
      isOpen: store.isSecondDialogOpen,
      setIsOpen: store.setIsSecondDialogOpen,
    },
    qr: {
      isOpen: store.isQRDialogOpen,
      setIsOpen: store.setIsQRDialogOpen,
    },
    resolveDispute: {
      isOpen: store.isResolveDisputeDialogOpen,
      setIsOpen: store.setIsResolveDisputeDialogOpen,
    },
    editMilestone: {
      isOpen: store.isEditMilestoneDialogOpen,
      setIsOpen: store.setIsEditMilestoneDialogOpen,
    },
    editEntities: {
      isOpen: store.isEditEntitiesDialogOpen,
      setIsOpen: store.setIsEditEntitiesDialogOpen,
    },
    editBasicProperties: {
      isOpen: store.isEditBasicPropertiesDialogOpen,
      setIsOpen: store.setIsEditBasicPropertiesDialogOpen,
    },
    successRelease: {
      isOpen: store.isSuccessReleaseDialogOpen,
      setIsOpen: store.setIsSuccessReleaseDialogOpen,
    },
    successResolveDispute: {
      isOpen: store.isSuccessResolveDisputeDialogOpen,
      setIsOpen: store.setIsSuccessResolveDisputeDialogOpen,
    },
    completeMilestone: {
      isOpen: store.isCompleteMilestoneDialogOpen,
      setIsOpen: store.setIsCompleteMilestoneDialogOpen,
    },
    isChangingStatus: store.isChangingStatus,
    isStartingDispute: store.isStartingDispute,
  };
};
