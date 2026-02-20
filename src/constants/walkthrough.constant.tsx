import type React from "react";
import {
  BookOpen,
  KeyRound,
  Link as LinkIcon,
  Rocket,
  ShieldCheck,
  Split,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export type WalkthroughIcon =
  | React.ReactNode
  | {
      kind: "image";
      src: string;
      alt?: string;
      className?: string;
    };

export interface WalkthroughStep {
  id: string;
  title: string | React.ReactNode;
  description: string;
  content?: React.ReactNode;
  icon?: WalkthroughIcon;
}

export const steps: WalkthroughStep[] = [
  {
    id: "intro",
    title: (
      <span>
        Welcome to{" "}
        <span className="font-bold text-primary">Trustless Work</span>{" "}
        <span className="text-muted-foreground">BackOffice</span>
      </span>
    ),
    description:
      "Trustless Work is escrow infrastructure on blockchain. This BackOffice is an abstraction to use the escrow service before you integrate it into your product.",

    icon: { kind: "image", src: "/logo.png", alt: "Trustless Work" },
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border bg-muted/30 p-4 text-left">
          <p className="text-sm font-medium">Infrastructure</p>
          <p className="text-sm text-muted-foreground mt-1">
            APIs + SDK + components to integrate escrows into your product.
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4 text-left">
          <p className="text-sm font-medium">BackOffice</p>
          <p className="text-sm text-muted-foreground mt-1">
            A dashboard to manage escrows, roles, milestones, and operations.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "escrow-101",
    title: "What is an escrow (and why use it)?",
    description:
      "An escrow locks funds with clear rules. It reduces risk, avoids “blind payments”, and releases funds only when conditions are met.",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    content: (
      <div className="rounded-lg border bg-muted/30 p-4 text-left">
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>
            <span className="text-foreground font-medium">Minimized trust</span>
            : rules live on blockchain infrastructure.
          </li>
          <li>
            <span className="text-foreground font-medium">Milestone-based</span>
            : delivery, evidence, approval, release.
          </li>
          <li>
            <span className="text-foreground font-medium">Transparency</span>:
            auditable states and movements.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "roles",
    title: "Roles in Trustless Work",
    description:
      "Permissions are defined by roles. Each role can perform specific actions across the escrow lifecycle.",
    icon: <Users className="h-8 w-8 text-primary" />,
    content: (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-4 text-left space-y-3">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors w-full sm:w-auto"
          href="https://docs.trustlesswork.com/trustless-work/technology-overview/roles-in-trustless-work"
          target="_blank"
          rel="noreferrer"
        >
          <BookOpen className="h-4 w-4" />
          Read More
        </Link>
      </div>
    ),
  },
  {
    id: "types",
    title: "Escrow types",
    description:
      "Pick the type that matches your flow: one payout at the end, or payouts per milestone.",
    icon: <Split className="h-8 w-8 text-primary" />,
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Single-Release</p>
          <p className="text-sm text-muted-foreground mt-1">
            Releases{" "}
            <span className="text-foreground font-medium">everything</span> once
            all milestones are approved.
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Multi-Release</p>
          <p className="text-sm text-muted-foreground mt-1">
            Releases{" "}
            <span className="text-foreground font-medium">per milestone</span>{" "}
            (incremental payouts as approvals happen).
          </p>
        </div>

        <div className="sm:col-span-2 flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-4 text-left space-y-3">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors w-full sm:w-auto"
            href="https://docs.trustlesswork.com/trustless-work/technology-overview/escrow-types"
            target="_blank"
            rel="noreferrer"
          >
            <BookOpen className="h-4 w-4" />
            Read More
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: "implementation",
    title: "Implementation tools",
    description:
      "Once the theory is clear, these are the building blocks to integrate Trustless Work into your product.",
    icon: <Wrench className="h-8 w-8 text-primary" />,
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <Link
          className="rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
          href="https://docs.trustlesswork.com/trustless-work/api-rest/introduction"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-sm font-medium">REST API</p>
          <p className="text-sm text-muted-foreground mt-1">
            Endpoints to create and operate escrows.
          </p>
        </Link>

        <Link
          className="rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
          href="https://docs.trustlesswork.com/trustless-work/escrow-react-sdk/introduction"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-sm font-medium">Escrow SDK</p>
          <p className="text-sm text-muted-foreground mt-1">
            React hooks/helpers (fast and safe).
          </p>
        </Link>

        <Link
          className="rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
          href="https://docs.trustlesswork.com/trustless-work/escrow-blocks-sdk/introduction"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-sm font-medium">Escrow Blocks</p>
          <p className="text-sm text-muted-foreground mt-1">
            Production-ready components (copy/paste).
          </p>
        </Link>
      </div>
    ),
  },
  {
    id: "api-key",
    title: "Request your API Key",
    description:
      "To use the services (API/SDK/Blocks), you need an active API Key. You can generate it from the BackOffice.",
    icon: <KeyRound className="h-8 w-8 text-primary" />,
    content: (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-4 text-left space-y-3">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors w-full sm:w-auto"
          href="/settings?tab=api-keys"
          target="_blank"
          rel="noreferrer"
        >
          <KeyRound className="h-4 w-4" />
          Go to API Keys
        </Link>
      </div>
    ),
  },
  {
    id: "resources",
    title: "Key resources",
    description: "Save these links: docs, tools, community, and repos.",
    icon: <LinkIcon className="h-8 w-8 text-primary" />,
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
        {[
          ["Website", "https://www.trustlesswork.com"],
          ["Docs", "https://docs.trustlesswork.com"],
          ["Escrow Lab", "https://demo.trustlesswork.com"],
          ["Blocks", "https://blocks.trustlesswork.com"],
          ["Discord", "https://discord.gg/bDydKq9n"],
          ["GitHub", "https://github.com/Trustless-Work"],
          ["Viewer", "https://viewer.trustlesswork.com"],
        ].map(([label, href]) => (
          <Link
            key={label}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="font-medium">{label}</span>
            <span className="text-muted-foreground text-xs break-all">
              {href.replace(/^https?:\/\//, "")}
            </span>
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "ready",
    title: "Ready to build",
    description:
      "Start small: define roles, pick the type (single or multi), and run an end-to-end flow. When you're ready, move to SDK/Blocks to integrate fast.",
    icon: <Rocket className="h-8 w-8 text-primary" />,
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Next step</p>
          <p className="text-sm text-muted-foreground mt-1">
            Request your API key and explore the BackOffice modules.
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">Questions?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Docs and Discord are the best places to unblock yourself quickly.
          </p>
        </div>
      </div>
    ),
  },
];
