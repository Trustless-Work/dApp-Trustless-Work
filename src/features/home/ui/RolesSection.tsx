"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  UserCheck,
  Unlock,
  Shield,
  Building2,
  User,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const RolesSection = () => {
  const roles = [
    {
      id: "approver",
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Approver",
      description:
        "Approves or disputes milestones marked as completed by the service provider.",
      examples: [
        "Buyer in a freelance marketplace approves deliverables",
        "Host in a security deposit scenario approves checkout",
        "Platform in a crowdfunding campaign approves milestones",
      ],
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "serviceProvider",
      icon: <UserCheck className="w-6 h-6" />,
      title: "ServiceProvider",
      description:
        "Delivers the product, service, or objective set on milestones and marks them as completed.",
      examples: [
        "Freelancer delivering a service and marking it complete",
        "Company updating crowdfunding milestones",
        "Real Estate inspector marking house inspections as complete",
      ],
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "releaseSigner",
      icon: <Unlock className="w-6 h-6" />,
      title: "ReleaseSigner",
      description:
        "Approves the release of funds for the amount set when all milestones are approved.",
      examples: [
        "Airbnb (platform) releasing a deposit",
        "eBay (platform) releasing payment to a seller",
        "DAO releasing a payment to a contributor",
      ],
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "disputeResolver",
      icon: <Shield className="w-6 h-6" />,
      title: "DisputeResolver",
      description:
        "Resolves disputes by distributing the balance between the receivers. Or do the withdraw remaining funds in multi-release escrow.",
      examples: [
        "Platform acting as arbiter for deposit disputes",
        "Independent third-party arbitrator setting new milestone prices",
        "Canceling an escrow and redirecting funds back to client",
      ],
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "platformAddress",
      icon: <Building2 className="w-6 h-6" />,
      title: "PlatformAddress",
      description:
        "Receives the platform fee and can update milestones while they are still pending.",
      examples: [
        "Airbnb collecting platform fees",
        "Crowdfunding platform taking a fee from funds raised",
        "Marketplace collecting transaction fees",
      ],
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      id: "receiver",
      icon: <User className="w-6 h-6" />,
      title: "Receiver",
      description:
        "The final recipient of funds after conditions are met or disputes are resolved.",
      examples: [
        "Freelancer receiving payment",
        "Tourist receiving a security deposit back",
        "Company receiving crowdfunding funds",
      ],
      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
  ];

  return (
    <section className="py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>

      <div className="w-full mx-auto relative z-10">
        {/* Header */}
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

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="group">
              <Card className="h-full border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-3 rounded-xl ${role.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">
                        {role.title}
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
                      {Array.isArray(role.examples) ? (
                        role.examples.map(
                          (example: string | object, exampleIndex: number) => (
                            <div
                              key={exampleIndex}
                              className="flex items-start gap-2"
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${role.color.replace("bg-", "bg-").replace("/10", "/30")}`}
                              />
                              -{" "}
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {typeof example === "string"
                                  ? example
                                  : String(example)}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          No examples available
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
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
                href="https://docs.trustlesswork.com/trustless-work/technology-overview/roles-in-trustless-work"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Read Full Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
