import { RoleAction } from "@/types/role-actions.entity";
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
    role: "signer",
    actions: ["fundEscrow"],
    icon: <Wallet className="h-6 w-6 text-primary" />,
    color: "",
  },
  {
    role: "approver",
    actions: ["fundEscrow", "approveMilestone", "startDispute"],
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "serviceProvider",
    actions: ["fundEscrow", "completeMilestone", "startDispute"],
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "disputeResolver",
    actions: ["fundEscrow", "resolveDispute"],
    icon: <Scale className="h-6 w-6 text-primary" />,
    color: "00",
  },
  {
    role: "releaseSigner",
    actions: ["fundEscrow", "releasePayment"],
    icon: <Unlock className="h-6 w-6 text-primary" />,
    color: "",
  },
  {
    role: "platformAddress",
    actions: ["fundEscrow", "editEscrow"],
    icon: <Settings className="h-6 w-6 text-primary" />,
    color: "0",
  },
  {
    role: "receiver",
    actions: ["fundEscrow"],
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    color: "",
  },
];

export const actionIcons: Record<string, React.ReactNode> = {
  fundEscrow: <DollarSign className="h-6 w-6 text-primary/60" />,
  approveMilestone: <CheckCircle className="h-6 w-6 text-primary/60" />,
  completeMilestone: <CheckSquare className="h-6 w-6 text-primary/60" />,
  startDispute: <AlertTriangle className="h-6 w-6 text-primary/60" />,
  resolveDispute: <Scale className="h-6 w-6 text-primary/60" />,
  releasePayment: <Unlock className="h-6 w-6 text-primary/60" />,
  editEscrow: <Edit className="h-6 w-6 text-primary/60" />,
};
