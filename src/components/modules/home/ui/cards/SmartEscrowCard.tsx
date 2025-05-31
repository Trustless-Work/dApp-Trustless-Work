"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const SmartEscrowCard = () => {
  const { t } = useTranslation("common");
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
        <div className="flex flex-col gap-6 sm:gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="text-sm text-foreground/60">{t("home.smartEscrow.card.properties.escrowId")}</div>
              <div className="font-mono text-sm">CAZUQX...MML</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="my-1" variant="outline">
                {t("home.smartEscrow.card.status.inDispute")}
              </Badge>
              <Badge className="my-1" variant="outline">
                {t("home.smartEscrow.card.status.released")}
              </Badge>
              <Badge className="my-1" variant="outline">
                {t("home.smartEscrow.card.status.resolved")}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <RoleBadge color="green" text={t("home.smartEscrow.card.roles.serviceProvider")} />
            <RoleBadge color="blue" text={t("home.smartEscrow.card.roles.approver")} />
            <RoleBadge color="red" text={t("home.smartEscrow.card.roles.disputeResolver")} />
            <RoleBadge color="yellow" text={t("home.smartEscrow.card.roles.releaseSigner")} />
            <RoleBadge color="pink" text={t("home.smartEscrow.card.roles.receiver")} />
            <RoleBadge color="purple" text={t("home.smartEscrow.card.roles.platformAddress")} />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <EscrowProperty label={t("home.smartEscrow.card.properties.balance")}
            value="1,000 USDC" />
          <EscrowProperty label={t("home.smartEscrow.card.properties.trustline")}
            value="USDC" />
          <EscrowProperty label={t("home.smartEscrow.card.properties.platformFee")}
            value="2%" />
          <EscrowProperty label={t("home.smartEscrow.card.properties.engagementId")}
            value="PRJ-2023-089" />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium mb-2">{t("home.smartEscrow.card.milestones.title")}</div>

          <Milestone
            title={t("home.smartEscrow.card.milestones.initialDesign")}
            status={t("home.smartEscrow.card.milestones.completed")}
            statusColor="blue"
            description={t("home.smartEscrow.card.milestones.initialDesignDesc")}
          />

          <Milestone
            title={t("home.smartEscrow.card.milestones.frontendDevelopment")}
            status={t("home.smartEscrow.card.milestones.inProgress")}
            statusColor="yellow"
            description={t("home.smartEscrow.card.milestones.frontendDevelopmentDesc")}
          />

          <Milestone
            title={t("home.smartEscrow.card.milestones.backendIntegration")}
            status={t("home.smartEscrow.card.milestones.pending")}
            statusColor="gray"
            description={t("home.smartEscrow.card.milestones.backendIntegrationDesc")}
          />

          <Milestone
            title={t("home.smartEscrow.card.milestones.backendIntegration")}
            status={t("home.smartEscrow.card.milestones.approved")}
            statusColor="green"
            description={t("home.smartEscrow.card.milestones.backendIntegrationDesc")}
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
