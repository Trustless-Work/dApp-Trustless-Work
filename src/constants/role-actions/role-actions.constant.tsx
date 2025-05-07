import { RoleAction } from "@/@types/role-actions";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  CheckSquare,
  DollarSign,
  Edit,
  Scale,
  Settings,
  Unlock,
  Wallet,
} from "lucide-react";
export const roleActions: RoleAction[] = [
  {
    role: "issuer",
    label: "Issuer",
    actions: ["Fund Escrow"],
    icon: <Wallet className="h-6 w-6 text-primary" />,
    color: "",
  },
  {
    role: "approver",
    label: "Approver",
    actions: ["Fund Escrow", "Approve Milestone", "Start Dispute"],
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "serviceProvider",
    label: "Service Provider",
    actions: ["Fund Escrow", "Complete Milestone", "Start Dispute"],
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "disputeResolver",
    label: "Dispute Resolver",
    actions: ["Fund Escrow", "Resolve Dispute"],
    icon: <Scale className="h-6 w-6 text-primary" />,
    color: "00",
  },
  {
    role: "releaseSigner",
    label: "Release Signer",
    actions: ["Fund Escrow", "Release payment"],
    icon: <Unlock className="h-6 w-6 text-primary" />,
    color: "",
  },
  {
    role: "platformAddress",
    label: "Platform Address",
    actions: ["Fund Escrow", "Edit Escrow"],
    icon: <Settings className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "receiver",
    label: "Receiver",
    actions: ["Fund Escrow"],
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    color: "",
  },
];

export const actionIcons: Record<string, React.ReactNode> = {
  "Fund Escrow": <DollarSign className="h-6 w-6 text-primary/60" />,
  "Approve Milestone": <CheckCircle className="h-6 w-6 text-primary/60" />,
  "Complete Milestone": <CheckSquare className="h-6 w-6 text-primary/60" />,
  "Start Dispute": <AlertTriangle className="h-6 w-6 text-primary/60" />,
  "Resolve Dispute": <Scale className="h-6 w-6 text-primary/60" />,
  "Release payment": <Unlock className="h-6 w-6 text-primary/60" />,
  "Edit Escrow": <Edit className="h-6 w-6 text-primary/60" />,
};
