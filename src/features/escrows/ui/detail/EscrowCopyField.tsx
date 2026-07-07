import { ResponsiveCopyField } from "@/components/shared/ResponsiveCopyField";

type EscrowCopyFieldProps = {
  label?: string;
  value: string;
  compact?: boolean;
  maxVisibleChars?: number;
  highlighted?: boolean;
  linkable?: boolean;
  onLinkHoverStart?: () => void;
  onLinkHoverEnd?: () => void;
};

export const EscrowCopyField = ({
  label,
  value,
  compact = false,
  maxVisibleChars,
  highlighted = false,
  linkable = false,
  onLinkHoverStart,
  onLinkHoverEnd,
}: EscrowCopyFieldProps) => (
  <ResponsiveCopyField
    label={label}
    value={value}
    compact={compact}
    maxVisibleChars={maxVisibleChars}
    highlighted={highlighted}
    linkable={linkable}
    onLinkHoverStart={onLinkHoverStart}
    onLinkHoverEnd={onLinkHoverEnd}
  />
);
