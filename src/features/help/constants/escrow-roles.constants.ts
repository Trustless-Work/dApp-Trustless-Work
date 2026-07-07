export type EscrowRoleGuide = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly cardinality: string;
  readonly actions: readonly string[];
  readonly constraints?: readonly string[];
};

export const ESCROW_ROLE_GUIDES: readonly EscrowRoleGuide[] = [
  {
    id: "approvers",
    title: "Approvers",
    description:
      "Review milestone deliverables and confirm that work meets the agreed scope before funds can move forward.",
    cardinality: "1–5 wallets",
    actions: [
      "Approve one or many milestones in a single transaction",
      "Approve and release in one step when the wallet is also a release signer",
    ],
  },
  {
    id: "service-providers",
    title: "Service providers",
    description:
      "Perform the work tracked by milestones and keep delivery status up to date on-chain.",
    cardinality: "1–5 wallets",
    actions: [
      "Change milestone status (for example pending → in progress → completed)",
      "Attach or update milestone evidence references",
    ],
  },
  {
    id: "release-signers",
    title: "Release signers",
    description:
      "Authorize payment once milestones are approved and the escrow is ready to settle.",
    cardinality: "1–5 wallets",
    actions: [
      "Release funds to the receiver when every milestone is approved (single release)",
      "Release individual milestones after approval (multi release)",
      "Approve and release atomically when the wallet is also an approver",
    ],
  },
  {
    id: "dispute-resolvers",
    title: "Dispute resolvers",
    description:
      "Settle conflicts by distributing escrow balances when a dispute is open.",
    cardinality: "1–5 wallets",
    actions: [
      "Resolve an open dispute with a full-balance distribution",
      "Withdraw any remaining balance after a release or resolution",
    ],
    constraints: [
      "Cannot open disputes — only resolve them",
      "Must not overlap with approvers, service providers, release signers, platform, or receiver",
    ],
  },
  {
    id: "admin",
    title: "Admin",
    description:
      "Maintains escrow configuration and milestone structure after deployment.",
    cardinality: "1 wallet",
    actions: [
      "Update escrow properties (roles, amount, fees, trustline, and metadata)",
      "Add milestones or edit milestone descriptions via manage milestones",
      "Extend contract storage TTL on multi-release escrows",
    ],
    constraints: [
      "Must be distinct from every other role address",
    ],
  },
  {
    id: "platform",
    title: "Platform",
    description:
      "Trustless Work platform wallet attached to the escrow. Receives the configured platform fee on release.",
    cardinality: "1 wallet",
    actions: [
      "Extend contract storage TTL on single-release escrows",
    ],
  },
  {
    id: "receiver",
    title: "Receiver",
    description:
      "Final beneficiary of released funds on single-release escrows.",
    cardinality: "1 wallet",
    actions: [
      "Receives funds when a release signer executes release",
    ],
    constraints: [
      "Defined at the escrow level in single release; in multi release each milestone has its own receiver",
    ],
  },
  {
    id: "observers",
    title: "Observers",
    description:
      "Read-only wallets attached for visibility. They cannot sign escrow transactions.",
    cardinality: "Optional list",
    actions: [
      "View escrow state and role assignments",
    ],
    constraints: [
      "No on-chain signing authority",
    ],
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
    signer: "Any escrow role except dispute resolvers",
  },
  {
    title: "Resolve dispute",
    description:
      "Distribute the full escrow balance across recipient wallets to close an open dispute.",
    signer: "Dispute resolver",
  },
  {
    title: "Withdraw remaining funds",
    description:
      "Sweep leftover balance after a release or resolution once the escrow is fully processed.",
    signer: "Dispute resolver",
  },
  {
    title: "Update escrow",
    description:
      "Replace platform-controlled fields while preserving milestone runtime state. Blocked when the escrow already holds funds.",
    signer: "Admin",
  },
  {
    title: "Manage milestones",
    description:
      "Add new milestones or edit descriptions atomically. Description-only edits are forbidden while funds are held.",
    signer: "Admin",
  },
  {
    title: "Extend storage TTL",
    description:
      "Renew Soroban contract storage so escrow state does not expire.",
    signer: "Platform on single release · Admin on multi release",
  },
] as const;

export const ESCROW_ROLE_RULES: readonly string[] = [
  "Role lists (approvers, service providers, release signers, dispute resolvers) accept up to 5 unique Stellar addresses each.",
  "Admin must not share an address with any other role.",
  "Dispute resolvers must not overlap with approvers, service providers, release signers, platform, or receiver.",
  "A wallet in both approvers and release signers can use approve-and-release to complete both steps in one transaction.",
  "Multi-release escrows store the receiver inside each milestone instead of at the escrow role level.",
] as const;
