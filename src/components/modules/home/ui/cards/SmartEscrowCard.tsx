"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const SmartEscrowCard = () => {
  return (
    <div className="relative">
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[80px] z-0"></div>

      <motion.div
        className="relative z-10 bg-background/80 dark:bg-background/40 backdrop-blur-md rounded-2xl p-8 border border-border shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center mb-6">
          <div>
            <div className="text-sm text-foreground/60">Escrow ID</div>
            <div className="font-mono text-sm">CAZUQX...MML</div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Badge className="my-2" variant="outline">
                In Dispute
              </Badge>

              <Badge className="my-2" variant="outline">
                Released
              </Badge>

              <Badge className="my-2" variant="outline">
                Resolved
              </Badge>
            </div>

            <Separator />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <RoleBadge color="green" text="Service Provider" />
            <RoleBadge color="blue" text="Approver" />
            <RoleBadge color="red" text="Dispute Resolver" />
            <RoleBadge color="yellow" text="Release Signer" />
            <RoleBadge color="pink" text="Receiver" />
            <RoleBadge color="purple" text="Platform Address" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <EscrowProperty label="Balance:" value="1,000 USDC" />
          <EscrowProperty label="Trustline:" value="USDC" />
          <EscrowProperty label="Platform Fee:" value="2%" />
          <EscrowProperty label="Engagement ID:" value="PRJ-2023-089" />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium mb-2">Milestones:</div>

          <Milestone
            title="Initial Design"
            status="Completed"
            statusColor="blue"
            description="Delivery of wireframes and mockups"
          />

          <Milestone
            title="Frontend Development"
            status="In Progress"
            statusColor="yellow"
            description="Implementation of user interface"
          />

          <Milestone
            title="Backend Integration"
            status="Pending"
            statusColor="gray"
            description="API integration and testing"
          />

          <Milestone
            title="Backend Integration"
            status="Approved"
            statusColor="green"
            description="API integration and testing"
          />
        </div>
      </motion.div>
    </div>
  );
};

interface RoleBadgeProps {
  color: "green" | "blue" | "red" | "yellow" | "pink" | "purple";
  text: string;
}

const RoleBadge = ({ color, text }: RoleBadgeProps) => {
  const colorClasses = {
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
  };

  return (
    <div
      className={`px-3 py-1 font-semibold ${colorClasses[color]} rounded-full text-sm`}
    >
      {text}
    </div>
  );
};

interface EscrowPropertyProps {
  label: string;
  value: string;
}

const EscrowProperty = ({ label, value }: EscrowPropertyProps) => {
  return (
    <div className="flex justify-between">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};

interface MilestoneProps {
  title: string;
  status: string;
  statusColor: "blue" | "yellow" | "gray" | "green";
  description: string;
}

const Milestone = ({
  title,
  status,
  statusColor,
  description,
}: MilestoneProps) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  };

  return (
    <div className="p-3 bg-background rounded-lg border border-border">
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{title}</div>
        <div
          className={`px-2 py-0.5 ${colorClasses[statusColor]} rounded-full text-xs`}
        >
          {status}
        </div>
      </div>
      <div className="text-sm text-foreground/70">{description}</div>
    </div>
  );
};
