import { CreatedAt } from "./dates.entity";

export interface Notification {
  id: string;
  contractId: string;
  type: string;
  title: string;
  message: string;
  entities: {
    approver?: string;
    serviceProvider?: string;
    platformAddress?: string;
    releaseSigner?: string;
    disputeResolver?: string;
    receiver?: string;
  };
  read: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
