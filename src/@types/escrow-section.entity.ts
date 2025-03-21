export type EscrowStatus =
  | "Pending Funding"
  | "Funded"
  | "Milestone Completed"
  | "Approved"
  | "Released"
  | "Disputed";

export interface Escrow {
  id: string;
  title: string;
  value: number;
  status: EscrowStatus;
  createdAt: string;
  updatedAt: string;
  parties: {
    sender: {
      id: string;
      name: string;
    };
    receiver: {
      id: string;
      name: string;
    };
  };
  milestones?: {
    id: string;
    title: string;
    value: number;
    status: string;
    dueDate: string;
  }[];
}

export interface EscrowStatusCount {
  status: EscrowStatus;
  count: number;
}

export interface EscrowTrend {
  date: string;
  value: number;
}
