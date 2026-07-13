"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ESCROW_ROLE_HELP_PATH,
  ESCROW_ROLE_ICONS,
  ESCROW_ROLE_LABELS,
  type EscrowRoleId,
} from "@/constants/escrow-roles.constants";
import { ArrowRight, Users, Zap } from "lucide-react";
import Link from "next/link";

type LandingRole = {
  readonly id: EscrowRoleId;
  readonly description: string;
  readonly examples: readonly string[];
};

const LANDING_ROLES: readonly LandingRole[] = [
  {
    id: "admin",
    description:
      "Owns escrow configuration after deploy: update terms, manage milestones, and extend contract TTL. Does not approve, release, or dispute.",
    examples: [
      "Marketplace operator adjusting escrow metadata before funding",
      "Project lead adding a new milestone mid-engagement",
      "Ops wallet renewing Soroban storage TTL",
    ],
  },
  {
    id: "approvers",
    description:
      "Review deliverables and approve milestones. Can open a dispute, and can approve-and-release when the wallet is also a release signer.",
    examples: [
      "Buyer approving freelance deliverables",
      "Host approving checkout in a security deposit flow",
      "Campaign sponsor signing off crowdfunding milestones",
    ],
  },
  {
    id: "service-providers",
    description:
      "Deliver the work tracked by milestones, update status and evidence on-chain, and can open a dispute when needed.",
    examples: [
      "Freelancer marking a milestone completed with evidence",
      "Contractor updating progress on a funded build",
      "Inspector recording inspection status for a property escrow",
    ],
  },
  {
    id: "release-signers",
    description:
      "Authorize payout once approvals are in place—whole escrow for single-release, per milestone for multi-release. Can also open a dispute.",
    examples: [
      "Platform releasing a deposit after approval",
      "DAO treasurer releasing payment to a contributor",
      "Marketplace settling an approved order",
    ],
  },
  {
    id: "dispute-resolvers",
    description:
      "Resolve open disputes by redistributing funds and withdraw remaining balances after a terminal state. Cannot open disputes, and must not overlap with other operational roles.",
    examples: [
      "Independent arbiter settling a delivery dispute",
      "Platform compliance wallet redistributing escrow balance",
      "Sweeping leftover funds after resolution",
    ],
  },
  {
    id: "platform",
    description:
      "Receives the configured platform fee on every release or dispute resolution, and can open a dispute. Cannot change itself after initialization.",
    examples: [
      "Marketplace collecting a transaction fee on release",
      "Crowdfunding platform taking its configured cut",
      "Hosting platform fee wallet on a deposit escrow",
    ],
  },
  {
    id: "receiver",
    description:
      "Final beneficiary of released funds. Can open a dispute (escrow-level in single-release; only their milestones in multi-release).",
    examples: [
      "Freelancer receiving payment after release",
      "Seller receiving marketplace settlement",
      "Contributor receiving a milestone payout",
    ],
  },
  {
    id: "observers",
    description:
      "Optional read-only wallets attached for visibility. They have no on-chain signing authority.",
    examples: [
      "Auditor watching escrow state without acting",
      "Compliance team following role assignments",
      "Stakeholder monitoring progress without signing",
    ],
  },
] as const;

const ROLE_ICON_WRAP =
  "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400";

export const RolesSection = () => {
  return (
    <section className="py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>

      <div className="w-full mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Roles in Trustless Work
            </h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each role has a distinct function within the escrow process,
            defining who can perform specific actions and how parties interact
            with the smart contract.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANDING_ROLES.map((role) => {
            const Icon = ESCROW_ROLE_ICONS[role.id];

            return (
              <div key={role.id} className="group">
                <Card className="h-full border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-3 rounded-xl border ${ROLE_ICON_WRAP} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {ESCROW_ROLE_LABELS[role.id]}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {role.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Examples
                        </span>
                      </div>

                      <div className="space-y-2">
                        {role.examples.map((example, exampleIndex) => (
                          <div
                            key={exampleIndex}
                            className="flex items-start gap-2"
                          >
                            <div className="mt-2 size-2 shrink-0 rounded-full bg-blue-500/30" />
                            <span className="text-xs text-muted-foreground leading-relaxed">
                              {example}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  Learn More About Roles
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Discover how each role interacts within the escrow lifecycle and
                understand the complete workflow.
              </p>
              <Link
                href={ESCROW_ROLE_HELP_PATH}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Open in-app Help
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
