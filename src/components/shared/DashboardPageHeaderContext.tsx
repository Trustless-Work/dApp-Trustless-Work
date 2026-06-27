"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardPageHeaderContextValue = {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
};

const DashboardPageHeaderContext =
  createContext<DashboardPageHeaderContextValue | null>(null);

export const DashboardPageHeaderProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [actions, setActionsState] = useState<ReactNode>(null);

  const setActions = useCallback((node: ReactNode) => {
    setActionsState(node);
  }, []);

  const value = useMemo(() => ({ actions, setActions }), [actions, setActions]);

  return (
    <DashboardPageHeaderContext.Provider value={value}>
      {children}
    </DashboardPageHeaderContext.Provider>
  );
};

function useDashboardPageHeaderContext() {
  const context = useContext(DashboardPageHeaderContext);

  if (!context) {
    throw new Error(
      "DashboardPageHeader components must be used within DashboardPageHeaderProvider",
    );
  }

  return context;
}

export const useDashboardPageHeaderActions = () => {
  return useDashboardPageHeaderContext().setActions;
};

export const useDashboardPageHeaderSlot = () => {
  return useDashboardPageHeaderContext().actions;
};

type DashboardPageHeaderActionsProps = {
  children: ReactNode;
};

export const DashboardPageHeaderActions = ({
  children,
}: DashboardPageHeaderActionsProps) => {
  const setActions = useDashboardPageHeaderActions();

  useLayoutEffect(() => {
    setActions(children);
    return () => setActions(null);
  }, [children, setActions]);

  return null;
};
