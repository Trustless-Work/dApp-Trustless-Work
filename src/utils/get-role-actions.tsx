import { RolesInEscrow } from "@/@types/escrow.entity";
import TooltipInfo from "@/components/utils/ui/Tooltip";
import {
  actionIcons,
  roleActions,
} from "@/constants/role-actions/role-actions.constant";
import { TFunction } from "i18next";

export const getRoleActionIcons = (
  role: RolesInEscrow,
  t: TFunction,
): React.ReactNode[] => {
  const roleData = roleActions.find((r) => r.role === role);
  if (!roleData) return [];

  return roleData.actions.map((action) => (
    <div
      key={action}
      className="inline-flex items-center justify-center rounded-full shadow-sm text-muted-foreground px-2"
    >
      <TooltipInfo content={t(`help.actions.${action}`)}>
        {actionIcons[action]}
      </TooltipInfo>
    </div>
  ));
};
