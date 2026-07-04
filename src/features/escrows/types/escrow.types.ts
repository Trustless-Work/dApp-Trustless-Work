export const ESCROW_TYPES = ["single-release", "multi-release"] as const;

export type EscrowType = (typeof ESCROW_TYPES)[number];

export function isEscrowType(value: string): value is EscrowType {
  return ESCROW_TYPES.includes(value as EscrowType);
}
