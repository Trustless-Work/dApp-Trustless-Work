import { useEscrowBoundedStore } from "../../../store/ui";

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
  const store = useEscrowBoundedStore();

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
    successRelease: {
      isOpen: store.isSuccessReleaseDialogOpen,
      setIsOpen: store.setIsSuccessReleaseDialogOpen,
    },
    successResolveDispute: {
      isOpen: store.isSuccessResolveDisputeDialogOpen,
      setIsOpen: store.setIsSuccessResolveDisputeDialogOpen,
    },
    isChangingStatus: store.isChangingStatus,
    isStartingDispute: store.isStartingDispute,
  };
};
