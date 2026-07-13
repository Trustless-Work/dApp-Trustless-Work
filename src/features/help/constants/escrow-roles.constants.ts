import type { LucideIcon } from "lucide-react";
import type { EscrowRoleId } from "@/constants/escrow-roles.constants";
import {
  ESCROW_ROLE_ICONS,
  ESCROW_ROLE_LABELS,
} from "@/constants/escrow-roles.constants";

export type EscrowRoleGuide = {
  readonly id: EscrowRoleId;
  readonly title: string;
  readonly icon: LucideIcon;
  readonly description: string;
  readonly cardinality: string;
  readonly actions: readonly string[];
  readonly constraints?: readonly string[];
};

export const ESCROW_ROLE_GUIDES: readonly EscrowRoleGuide[] = [
  {
    id: "approvers",
    title: ESCROW_ROLE_LABELS.approvers,
    icon: ESCROW_ROLE_ICONS.approvers,
    description:
      "Review milestone deliverables and confirm that work meets the agreed scope before funds can move forward.",
    cardinality: "1–5 wallets",
    actions: [
      "Approve one or many milestones in a single transaction",
      "Open a dispute when delivery or payment is contested",
      "Approve and release in one step when the wallet is also a release signer",
    ],
  },
  {
    id: "service-providers",
    title: ESCROW_ROLE_LABELS["service-providers"],
    icon: ESCROW_ROLE_ICONS["service-providers"],
    description:
      "Perform the work tracked by milestones and keep delivery status up to date on-chain.",
    cardinality: "1–5 wallets",
    actions: [
      "Change milestone status (for example pending → in progress → completed)",
      "Attach or update milestone evidence references",
      "Open a dispute when delivery or payment is contested",
    ],
  },
  {
    id: "release-signers",
    title: ESCROW_ROLE_LABELS["release-signers"],
    icon: ESCROW_ROLE_ICONS["release-signers"],
    description:
      "Authorize payment once milestones are approved and the escrow is ready to settle.",
    cardinality: "1–5 wallets",
    actions: [
      "Release funds to the receiver when every milestone is approved (single release)",
      "Release individual milestones after approval (multi release)",
      "Open a dispute when delivery or payment is contested",
      "Approve and release atomically when the wallet is also an approver",
    ],
  },
  {
    id: "dispute-resolvers",
    title: ESCROW_ROLE_LABELS["dispute-resolvers"],
    icon: ESCROW_ROLE_ICONS["dispute-resolvers"],
    description:
      "Settle conflicts by distributing escrow balances when a dispute is open.",
    cardinality: "1–5 wallets",
    actions: [
      "Resolve an open dispute (single: distributions must equal the contract balance; multi: sum at most the selected milestones' amounts)",
      "Withdraw any remaining balance after the escrow reaches a terminal state (multi: every milestone must be released or dispute-resolved)",
    ],
    constraints: [
      "Cannot open disputes — only resolve them",
      "Must not overlap with approvers, service providers, release signers, or receiver",
    ],
  },
  {
    id: "admin",
    title: ESCROW_ROLE_LABELS.admin,
    icon: ESCROW_ROLE_ICONS.admin,
    description:
      "Maintains escrow configuration and milestone structure after deployment.",
    cardinality: "1 wallet",
    actions: [
      "Update escrow properties (roles, amount, fees, trustline, and metadata) while unfunded",
      "Add milestones or edit milestone descriptions via manage milestones",
      "Extend contract storage TTL",
    ],
    constraints: [
      "Cannot also be an approver, service provider, release signer, or dispute resolver",
      "Cannot be the same address as receiver on single-release escrows",
      "Immutable after the escrow is initialized",
    ],
  },
  {
    id: "platform",
    title: ESCROW_ROLE_LABELS.platform,
    icon: ESCROW_ROLE_ICONS.platform,
    description:
      "Trustless Work platform wallet attached to the escrow. Receives the configured platform fee on release or dispute resolution.",
    cardinality: "1 wallet",
    actions: [
      "Receive the platform fee on every release or dispute resolution",
      "Open a dispute when delivery or payment is contested",
    ],
    constraints: ["Cannot change itself once the escrow is initialized"],
  },
  {
    id: "receiver",
    title: ESCROW_ROLE_LABELS.receiver,
    icon: ESCROW_ROLE_ICONS.receiver,
    description:
      "Final beneficiary of released funds. Passive on payout; can open a dispute for their escrow or milestones.",
    cardinality: "1 wallet (single) · 1 per milestone (multi)",
    actions: [
      "Receive funds when a release signer executes release",
      "Open a dispute (escrow-level in single release; only their milestones in multi release)",
    ],
    constraints: [
      "Defined at the escrow level in single release; in multi release each milestone has its own receiver",
      "Cannot be the same address as admin on single-release escrows",
    ],
  },
  {
    id: "observers",
    title: ESCROW_ROLE_LABELS.observers,
    icon: ESCROW_ROLE_ICONS.observers,
    description:
      "Read-only wallets attached for visibility. They cannot sign escrow transactions.",
    cardinality: "Optional list, 0–5 wallets",
    actions: ["View escrow state and role assignments"],
    constraints: ["No on-chain signing authority"],
  },
] as const;

export type EscrowLifecycleAction = {
  readonly title: string;
  readonly description: string;
  readonly signer: string;
};

export const ESCROW_LIFECYCLE_ACTIONS: readonly EscrowLifecycleAction[] = [
  {
    title: "Fund escrow",
    description:
      "Deposit the escrow amount into the contract. Any wallet with sufficient balance can fund.",
    signer: "Depositor wallet",
  },
  {
    title: "Change milestone status",
    description:
      "Update delivery progress and optional evidence for one or more milestones in a batch.",
    signer: "Service provider",
  },
  {
    title: "Approve milestones",
    description:
      "Mark milestones as approved after reviewing deliverables. Supports batch approval.",
    signer: "Approver",
  },
  {
    title: "Release funds",
    description:
      "Move approved funds to the receiver. Single release requires all milestones approved; multi release works per milestone.",
    signer: "Release signer",
  },
  {
    title: "Start dispute",
    description:
      "Open a dispute with an on-chain reason when parties disagree on delivery or payment.",
    signer:
      "Approver, service provider, release signer, receiver, or platform (not dispute resolvers)",
  },
  {
    title: "Resolve dispute",
    description:
      "Close an open dispute by redistributing funds. Single release requires distributions to equal the contract balance; multi release allows a sum at most the selected milestones' amounts.",
    signer: "Dispute resolver",
  },
  {
    title: "Withdraw remaining funds",
    description:
      "Sweep leftover balance after a release or resolution once the escrow is fully processed. Multi release requires every milestone to be released or dispute-resolved.",
    signer: "Dispute resolver",
  },
  {
    title: "Update escrow",
    description:
      "Replace configurable fields while preserving milestone runtime state. Blocked when the escrow already holds funds or a dispute is open.",
    signer: "Admin",
  },
  {
    title: "Manage milestones",
    description:
      "Add new milestones or edit descriptions atomically. Description/amount edits of existing milestones are forbidden while funds are held. Single release blocks manage after release; multi release blocks only when all milestones are released.",
    signer: "Admin",
  },
  {
    title: "Extend storage TTL",
    description:
      "Renew Soroban contract storage so escrow state does not expire.",
    signer: "Admin",
  },
] as const;

export const ESCROW_ROLE_RULES: readonly string[] = [
  "Role lists (approvers, service providers, release signers, dispute resolvers, observers) accept up to 5 unique Stellar addresses each.",
  "Admin must not share an address with approvers, service providers, release signers, or dispute resolvers, and must not be the receiver on single-release escrows.",
  "Dispute resolvers must not overlap with approvers, service providers, release signers, or receiver.",
  "The same wallet may be an approver, service provider, release signer, and receiver at once when those overlaps are allowed.",
  "A wallet in both approvers and release signers can use approve-and-release to complete both steps in one transaction.",
  "Multi-release escrows store the receiver inside each milestone instead of at the escrow role level.",
] as const;
