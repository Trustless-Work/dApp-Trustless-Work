import { EscrowRoleIcon } from "@/components/shared/EscrowRoleIcon";
import { Badge } from "@/components/ui/badge";
import type { EscrowRoleGuide } from "@/features/help/constants/escrow-roles.constants";

type EscrowRoleGuideCardProps = {
  role: EscrowRoleGuide;
};

export const EscrowRoleGuideCard = ({ role }: EscrowRoleGuideCardProps) => {
  return (
    <li
      id={role.id}
      className="scroll-mt-28 min-w-0 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <EscrowRoleIcon roleId={role.id} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold tracking-tight">
              {role.title}
            </h3>
            <Badge variant="secondary" className="shrink-0 uppercase">
              {role.cardinality}
            </Badge>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {role.description}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Actions
        </p>
        <ul className="space-y-1.5">
          {role.actions.map((action) => (
            <li
              key={action}
              className="flex gap-2 text-sm leading-relaxed text-foreground"
            >
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
              />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {role.constraints && role.constraints.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Constraints
          </p>
          <ul className="space-y-1.5">
            {role.constraints.map((constraint) => (
              <li
                key={constraint}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
};
