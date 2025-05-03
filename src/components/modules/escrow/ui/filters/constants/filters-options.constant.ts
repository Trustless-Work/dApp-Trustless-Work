export const amountOptionsFilters = [
  { label: "All amounts", value: "all" },
  { label: "Under $100", value: "0-100" },
  { label: "$100 - $500", value: "100-500" },
  { label: "$500 - $1000", value: "500-1000" },
  { label: "Over $1000", value: "1000+" },
];

export const statusOptionsFilters = [
  { label: "All statuses", value: "all" },
  { label: "Working", value: "working" },
  { label: "Pending Release", value: "pendingRelease" },
  { label: "Released", value: "released" },
  { label: "Resolved", value: "resolved" },
  { label: "In Dispute", value: "inDispute" },
];

export const activeOptionsFilters = [
  { label: "Active", value: "active" },
  { label: "Trash", value: "trashed" },
];
