"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import SuccessCheckmark from "./SuccessCheckmark";

interface TransferAnimationProps {
  title?: string;
  fromLabel?: string;
  fromAmount?: string;
  fromCurrency?: string;
  toLabel?: string;
  toAmount?: string;
  toCurrency?: string;
  additionalInfo?: string;
  className?: string;
}

const TransferAnimation = ({
  title = "Transfer Successful",
  fromLabel = "From",
  fromAmount = "0.00",
  fromCurrency = "USD",
  toLabel = "To",
  toAmount = "0.00",
  toCurrency = "USD",
  additionalInfo,
  className = "",
}: TransferAnimationProps) => {
  return (
    <Card
      className={`w-full max-w-md mx-auto p-6 min-h-[300px] flex flex-col justify-center hover:shadow-md ${className}`}
    >
      <CardContent className="space-y-4 flex flex-col items-center justify-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            scale: {
              type: "spring",
              damping: 15,
              stiffness: 200,
            },
          }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 blur-xl bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                ease: "easeOut",
              }}
            />
            <SuccessCheckmark
              size={80}
              strokeWidth={4}
              color="rgb(16 185 129)"
              className="relative z-10 dark:drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            />
          </div>
        </motion.div>
        <motion.div
          className="space-y-2 text-center w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <motion.h2
            className="text-lg tracking-tighter font-semibold"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            {title}
          </motion.h2>
          <div className="flex items-center gap-4">
            <motion.div
              className="flex-1 bg-background/50 dark:bg-background/50 rounded-xl p-3 border border-border/50 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.2,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>From</title>
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    {fromLabel}
                  </span>
                  <div className="flex items-center gap-2.5 group transition-all">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-background shadow-lg border border-border text-sm font-medium text-foreground group-hover:scale-105 transition-transform">
                      $
                    </span>
                    <span className="font-medium text-foreground tracking-tight">
                      {fromAmount} {fromCurrency}
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>To</title>
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                    {toLabel}
                  </span>
                  <div className="flex items-center gap-2.5 group transition-all">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-background shadow-lg border border-border text-sm font-medium text-foreground group-hover:scale-105 transition-transform">
                      $
                    </span>
                    <span className="font-medium text-foreground tracking-tight">
                      {toAmount} {toCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          {additionalInfo && (
            <motion.div
              className="w-full text-xs text-muted-foreground mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
            >
              {additionalInfo}
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TransferAnimation;
