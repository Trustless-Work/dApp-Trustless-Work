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
    icon: <Wallet className="h-6 w-6" />,
    color: "bg-blue-100",
  },
  {
    role: "approver",
    label: "Approver",
    actions: ["Fund Escrow", "Approve Milestone", "Start Dispute"],
    icon: <CheckCircle className="h-6 w-6" />,
    color: "bg-green-100",
  },
  {
    role: "serviceProvider",
    label: "Service Provider",
    actions: ["Fund Escrow", "Complete Milestone", "Start Dispute"],
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-amber-100",
  },
  {
    role: "disputeResolver",
    label: "Dispute Resolver",
    actions: ["Fund Escrow", "Resolve Dispute"],
    icon: <Scale className="h-6 w-6" />,
    color: "bg-purple-100",
  },
  {
    role: "releaseSigner",
    label: "Release Signer",
    actions: ["Fund Escrow", "Release payment"],
    icon: <Unlock className="h-6 w-6" />,
    color: "bg-rose-100",
  },
  {
    role: "platformAddress",
    label: "Platform Address",
    actions: ["Fund Escrow", "Edit Escrow"],
    icon: <Settings className="h-6 w-6" />,
    color: "bg-slate-100",
  },
  {
    role: "receiver",
    label: "Receiver",
    actions: ["Fund Escrow"],
    icon: <DollarSign className="h-6 w-6" />,
    color: "bg-teal-100",
  },
];

export const actionIcons: Record<string, React.ReactNode> = {
  "Fund Escrow": <DollarSign className="h-6 w-6" />,
  "Approve Milestone": <CheckCircle className="h-6 w-6" />,
  "Complete Milestone": <CheckSquare className="h-6 w-6" />,
  "Start Dispute": <AlertTriangle className="h-6 w-6" />,
  "Resolve Dispute": <Scale className="h-6 w-6" />,
  "Release payment": <Unlock className="h-6 w-6" />,
  "Edit Escrow": <Edit className="h-6 w-6" />,
};
