import type { Escrow, EscrowTrend } from "@/@types/escrow-section.entity";

export const mockEscrows: Escrow[] = [
  {
    id: "esc-001",
    title: "Website Development Project",
    value: 15000,
    status: "Funded",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-05T14:30:00Z",
    parties: {
      sender: { id: "user-1", name: "Acme Corp" },
      receiver: { id: "user-2", name: "Web Developers Inc" },
    },
    milestones: [
      {
        id: "ms-001",
        title: "Design Phase",
        value: 5000,
        status: "Completed",
        dueDate: "2023-12-15T00:00:00Z",
      },
      {
        id: "ms-002",
        title: "Development Phase",
        value: 7000,
        status: "In Progress",
        dueDate: "2024-01-15T00:00:00Z",
      },
      {
        id: "ms-003",
        title: "Testing Phase",
        value: 3000,
        status: "Pending",
        dueDate: "2024-02-01T00:00:00Z",
      },
    ],
  },
  {
    id: "esc-002",
    title: "Mobile App Development",
    value: 25000,
    status: "Milestone Completed",
    createdAt: "2023-11-15T09:00:00Z",
    updatedAt: "2023-12-10T11:20:00Z",
    parties: {
      sender: { id: "user-3", name: "TechStart LLC" },
      receiver: { id: "user-4", name: "App Builders Co" },
    },
  },
  {
    id: "esc-003",
    title: "Logo Design Project",
    value: 2500,
    status: "Released",
    createdAt: "2023-12-05T14:00:00Z",
    updatedAt: "2023-12-12T16:45:00Z",
    parties: {
      sender: { id: "user-5", name: "New Venture Inc" },
      receiver: { id: "user-6", name: "Creative Designs" },
    },
  },
  {
    id: "esc-004",
    title: "Marketing Campaign",
    value: 10000,
    status: "Disputed",
    createdAt: "2023-11-20T11:30:00Z",
    updatedAt: "2023-12-08T09:15:00Z",
    parties: {
      sender: { id: "user-7", name: "Retail Chain Corp" },
      receiver: { id: "user-8", name: "Marketing Experts" },
    },
  },
  {
    id: "esc-005",
    title: "Content Creation",
    value: 5000,
    status: "Approved",
    createdAt: "2023-12-02T13:45:00Z",
    updatedAt: "2023-12-09T10:30:00Z",
    parties: {
      sender: { id: "user-9", name: "Media House" },
      receiver: { id: "user-10", name: "Content Creators Guild" },
    },
  },
  {
    id: "esc-006",
    title: "E-commerce Integration",
    value: 12000,
    status: "Pending Funding",
    createdAt: "2023-12-07T15:20:00Z",
    updatedAt: "2023-12-07T15:20:00Z",
    parties: {
      sender: { id: "user-11", name: "Retail Solutions" },
      receiver: { id: "user-12", name: "E-commerce Experts" },
    },
  },
  {
    id: "esc-007",
    title: "SEO Optimization",
    value: 4500,
    status: "Funded",
    createdAt: "2023-11-25T10:15:00Z",
    updatedAt: "2023-12-03T14:00:00Z",
    parties: {
      sender: { id: "user-13", name: "Online Store Inc" },
      receiver: { id: "user-14", name: "SEO Specialists" },
    },
  },
  {
    id: "esc-008",
    title: "Server Infrastructure Setup",
    value: 18000,
    status: "Milestone Completed",
    createdAt: "2023-11-10T09:30:00Z",
    updatedAt: "2023-12-05T16:45:00Z",
    parties: {
      sender: { id: "user-15", name: "Tech Solutions Ltd" },
      receiver: { id: "user-16", name: "Infrastructure Pros" },
    },
  },
];

// Generate mock release trends data (last 12 months)
export const mockReleaseTrends: EscrowTrend[] = (() => {
  const trends: EscrowTrend[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = Math.floor(Math.random() * 15) + 5; // Random value between 5-20

    trends.push({
      date: date.toISOString().split("T")[0],
      value,
    });
  }

  return trends;
})();

// Generate mock volume trends data (last 12 months)
export const mockVolumeTrends: EscrowTrend[] = (() => {
  const trends: EscrowTrend[] = [];
  const now = new Date();

  let baseValue = 50000;

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Create a slightly increasing trend with some randomness
    baseValue = baseValue + (Math.random() * 10000 - 2000);

    trends.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(baseValue),
    });
  }

  return trends;
})();
