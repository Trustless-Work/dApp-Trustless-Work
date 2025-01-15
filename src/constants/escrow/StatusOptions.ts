export const statusOptions = [
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
  { value: "forReview", label: "In Review" },
  { value: "inDispute", label: "In Dispute" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
];

export const statusMap: Record<string, string[]> = {
  pending: ["forReview"],
  forReview: ["approved", "inDispute"],
  approved: ["release"],
  inDispute: ["resolve"],
};
