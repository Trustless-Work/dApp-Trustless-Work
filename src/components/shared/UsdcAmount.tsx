import Image from "next/image";
import type { ReactNode } from "react";
import { formatAssetAmount, isUsdcSymbol } from "@/helpers/format.helper";
import { cn } from "@/lib/utils";

type UsdcAmountSize = "sm" | "md" | "lg";

type UsdcAmountProps = {
  amount: number;
  symbol: string;
  className?: string;
  iconClassName?: string;
  size?: UsdcAmountSize;
  emphasis?: boolean;
};

const iconSizes: Record<UsdcAmountSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const textSizes: Record<UsdcAmountSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const UsdcAmount = ({
  amount,
  symbol,
  className,
  iconClassName,
  size = "md",
  emphasis = false,
}: UsdcAmountProps) => {
  const isUsdc = isUsdcSymbol(symbol);
  const iconSize = iconSizes[size];
  const formattedAmount = formatAssetAmount(amount);

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-2 tabular-nums",
        className,
      )}
    >
      {isUsdc ? (
        <Image
          src="/usdc.webp"
          alt="USDC"
          width={iconSize}
          height={iconSize}
          className={cn("shrink-0 rounded-full", iconClassName)}
        />
      ) : null}
      <span
        className={cn(
          "truncate font-medium",
          textSizes[size],
          emphasis && "font-semibold",
        )}
      >
        {isUsdc ? formattedAmount : `${formattedAmount} ${symbol}`}
      </span>
    </span>
  );
};

type UsdcAmountStatProps = {
  label: string;
  amount: number;
  symbol: string;
  emphasis?: boolean;
};

export const UsdcAmountStat = ({
  label,
  amount,
  symbol,
  emphasis = false,
}: UsdcAmountStatProps) => {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1">
        <UsdcAmount
          amount={amount}
          symbol={symbol}
          size={emphasis ? "lg" : "md"}
          emphasis={emphasis}
        />
      </dd>
    </div>
  );
};

type OverviewStatProps = {
  label: string;
  value: ReactNode;
  mono?: boolean;
};

export const OverviewStat = ({ label, value, mono }: OverviewStatProps) => {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "mt-1 truncate text-base font-medium",
          mono && "font-mono text-sm",
        )}
      >
        {value}
      </dd>
    </div>
  );
};
