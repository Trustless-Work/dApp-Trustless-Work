import * as React from "react";

import { useSidebar } from "@/components/ui/sidebar";

const LOCK_RELEASE_DELAY_MS = 200;

export function useSidebarDropdownLock() {
  const { isMobile, setSidebarExpandedLock } = useSidebar();
  const lockReleaseTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const releaseLock = React.useCallback(() => {
    if (isMobile) {
      return;
    }

    if (lockReleaseTimeoutRef.current) {
      clearTimeout(lockReleaseTimeoutRef.current);
      lockReleaseTimeoutRef.current = null;
    }

    setSidebarExpandedLock(false);
  }, [isMobile, setSidebarExpandedLock]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (isMobile) {
        return;
      }

      if (lockReleaseTimeoutRef.current) {
        clearTimeout(lockReleaseTimeoutRef.current);
        lockReleaseTimeoutRef.current = null;
      }

      if (open) {
        setSidebarExpandedLock(true);
        return;
      }

      lockReleaseTimeoutRef.current = setTimeout(() => {
        setSidebarExpandedLock(false);
        lockReleaseTimeoutRef.current = null;
      }, LOCK_RELEASE_DELAY_MS);
    },
    [isMobile, setSidebarExpandedLock],
  );

  React.useEffect(() => {
    return () => {
      if (lockReleaseTimeoutRef.current) {
        clearTimeout(lockReleaseTimeoutRef.current);
      }
    };
  }, []);

  return { handleOpenChange, releaseLock };
}
