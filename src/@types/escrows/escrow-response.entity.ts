import { Status } from "../http.entity";
import type { EscrowPayload } from "./escrow-payload.entity";

// Escrow's Response
export type EscrowRequestResponse = {
  status: Status;
  unsignedTransaction?: string;
};

export type InitializeEscrowResponse = {
  contractId: string;
  escrow: EscrowPayload;
  message: string;
  status: Status;
};

export type UpdateEscrowResponse = InitializeEscrowResponse;
