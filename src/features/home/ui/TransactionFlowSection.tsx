"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Database,
  Send,
  FileText,
  Shield,
  CheckCircle,
} from "lucide-react";

export const TransactionFlowSection = () => {
  const flowSteps = [
    {
      id: 1,
      title: "Prepare Payload",
      description: "Create the transaction payload with required parameters",
      icon: FileText,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 2,
      title: "Execute Endpoint",
      description: "Send the payload to the Trustless Work API endpoint",
      icon: Database,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 3,
      title: "Get Unsigned TX",
      description: "Receive the unsigned transaction from the API",
      icon: Code,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 4,
      title: "Sign Transaction",
      description: "Sign the transaction using wallet or passkey",
      icon: Shield,
      badge: "wallet",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      id: 5,
      title: "Send Transaction",
      description: "Submit the signed transaction to the blockchain",
      icon: Send,
      badge: "dApp",
      color:
        "bg-slate-100/50 border-slate-200/50 dark:bg-slate-800/30 dark:border-slate-700/50",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>

      <div className="w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 border border-primary/20">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent text-center">
              Escrow Transaction Flow
            </h2>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Understand the complete process from payload preparation to
            transaction execution
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Flow Diagram
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Visual representation of the 5-step escrow transaction process
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="relative">
                {/* Connection Line - Hidden on mobile, visible on larger screens */}
                <div className="hidden sm:block absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"></div>

                <div className="space-y-6 sm:space-y-8">
                  {flowSteps.map((step) => (
                    <div key={step.id} className="relative">
                      {/* Step Card */}
                      <div className="relative">
                        {/* Connection Dot - Hidden on mobile, visible on larger screens */}
                        <div className="hidden sm:block absolute left-6 top-6 w-3 h-3 bg-primary rounded-full border-2 border-background transform -translate-x-1/2 z-10"></div>

                        <div
                          className={`sm:ml-12 p-4 sm:p-6 rounded-xl border ${step.color} shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Step Number */}
                            <div className="flex-shrink-0 flex justify-center sm:justify-start">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <span className="text-base sm:text-lg font-bold text-primary">
                                  {step.id}
                                </span>
                              </div>
                            </div>

                            {/* Step Content */}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                <div className="flex justify-center sm:justify-start">
                                  <div className="p-2 rounded-lg bg-primary/5">
                                    <step.icon
                                      className={`w-4 h-4 sm:w-5 sm:h-5 ${step.iconColor}`}
                                    />
                                  </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                                  {step.title}
                                </h3>
                                <div className="flex justify-center sm:justify-start">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-medium"
                                  >
                                    {step.badge}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex justify-center sm:justify-start">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-semibold text-foreground mb-1 text-base sm:text-lg">
                      Transaction Flow Summary
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      This 5-step process ensures secure and transparent escrow
                      transactions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
