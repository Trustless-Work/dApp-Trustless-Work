"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getStellarExpertTransactionUrl } from "@/helpers/escrow-explorer.helper";
import type { NetworkType } from "@/types/network.entity";

type TransactionSuccessToastDescriptionProps = {
  txHash: string;
  network: NetworkType;
  durationMs: number;
  toastId: string | number;
};

export const TransactionSuccessToastDescription = ({
  txHash,
  network,
  durationMs,
  toastId,
}: TransactionSuccessToastDescriptionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [remainingProgress, setRemainingProgress] = useState(100);
  const stellarExpertUrl = getStellarExpertTransactionUrl(network, txHash);

  useEffect(() => {
    const toastElement = containerRef.current?.closest("[data-sonner-toast]");

    if (!toastElement) {
      return;
    }

    const elapsedMsRef = { current: 0 };
    const lastFrameTimeRef = { current: null as number | null };
    const isPausedRef = { current: false };
    let animationFrameId = 0;

    const pauseCountdown = () => {
      isPausedRef.current = true;
      lastFrameTimeRef.current = null;
    };

    const resumeCountdown = () => {
      isPausedRef.current = false;
    };

    const tick = (now: number) => {
      if (!isPausedRef.current) {
        if (lastFrameTimeRef.current !== null) {
          elapsedMsRef.current += now - lastFrameTimeRef.current;
        }

        const remainingRatio = Math.max(
          0,
          1 - elapsedMsRef.current / durationMs,
        );
        setRemainingProgress(remainingRatio * 100);

        if (elapsedMsRef.current >= durationMs) {
          toast.dismiss(toastId);
          return;
        }

        lastFrameTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    toastElement.addEventListener("mouseenter", pauseCountdown);
    toastElement.addEventListener("mouseleave", resumeCountdown);
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      toastElement.removeEventListener("mouseenter", pauseCountdown);
      toastElement.removeEventListener("mouseleave", resumeCountdown);
    };
  }, [durationMs, toastId]);

  return (
    <div ref={containerRef} className="flex w-full min-w-0 flex-col gap-2.5">
      <p className="text-[13px] leading-snug font-normal opacity-90">
        <a
          href={stellarExpertUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer underline underline-offset-2 hover:opacity-100"
        >
          View
        </a>
        {" transaction on Stellar Expert"}
      </p>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
        aria-hidden="true"
      >
        <div
          className="h-full w-full origin-left rounded-full bg-current opacity-70 transition-none"
          style={{ transform: `scaleX(${remainingProgress / 100})` }}
        />
      </div>
    </div>
  );
};
