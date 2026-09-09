export function formatRequestCount(value: string): string {
  try {
    return BigInt(value).toLocaleString("en-US");
  } catch {
    return value;
  }
}

export function compareRequestCounts(left: string, right: string): number {
  try {
    const leftValue = BigInt(left);
    const rightValue = BigInt(right);
    if (leftValue === rightValue) {
      return 0;
    }
    return leftValue > rightValue ? 1 : -1;
  } catch {
    return left.localeCompare(right);
  }
}
