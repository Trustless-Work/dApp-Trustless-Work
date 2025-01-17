export const statusOptions = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

export const statusMap: Record<string, string[]> = {
  pending: ["completed"],
  completed: ["approved" /*, "inDispute"*/],
};
