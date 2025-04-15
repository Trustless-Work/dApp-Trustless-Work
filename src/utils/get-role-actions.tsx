import { RolesInEscrow } from "@/@types/escrow.entity";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  actionIcons,
  roleActions,
} from "@/constants/role-actions/role-actions.constant";

export const getRoleActionIcons = (role: RolesInEscrow): React.ReactNode[] => {
  const roleData = roleActions.find((r) => r.role === role);
  if (!roleData) return [];

  return roleData.actions.map((action) => (
    <div
      key={action}
      className="inline-flex items-center justify-center rounded-full shadow-sm text-muted-foreground"
    >
      <TooltipInfo content={action}>{actionIcons[action]}</TooltipInfo>
    </div>
  ));
};
