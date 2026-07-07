import {
  ESCROW_LIFECYCLE_ACTIONS,
  ESCROW_ROLE_GUIDES,
  ESCROW_ROLE_RULES,
} from "@/features/help/constants/escrow-roles.constants";
import { EscrowRoleGuideCard } from "@/features/help/ui/EscrowRoleGuideCard";

export const EscrowRolesHelpSection = () => {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg font-semibold tracking-tight">Escrow roles</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Every escrow on Trustless Work assigns Stellar wallets to on-chain
          roles. Each role controls specific actions enforced by the smart
          contract — the dApp surfaces available actions based on your connected
          wallet.
        </p>

        <ul className="mt-6 grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2">
          {ESCROW_ROLE_GUIDES.map((role) => (
            <EscrowRoleGuideCard key={role.id} role={role} />
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg font-semibold tracking-tight">
          Escrow lifecycle actions
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Typical flow from funding to settlement. The signer column shows which
          role must authorize each transaction.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="hidden w-full min-w-[36rem] border-collapse text-sm md:table">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 font-medium text-muted-foreground">
                  Action
                </th>
                <th className="pb-3 pr-4 font-medium text-muted-foreground">
                  Description
                </th>
                <th className="pb-3 font-medium text-muted-foreground">
                  Signer
                </th>
              </tr>
            </thead>
            <tbody>
              {ESCROW_LIFECYCLE_ACTIONS.map((action) => (
                <tr
                  key={action.title}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-medium">
                    {action.title}
                  </td>
                  <td className="py-3 pr-4 align-top text-muted-foreground">
                    {action.description}
                  </td>
                  <td className="py-3 align-top text-muted-foreground">
                    {action.signer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="flex flex-col gap-3 md:hidden">
            {ESCROW_LIFECYCLE_ACTIONS.map((action) => (
              <li
                key={action.title}
                className="rounded-2xl border border-border bg-muted/30 p-4"
              >
                <p className="font-medium">{action.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Signer
                </p>
                <p className="mt-1 text-sm text-foreground">{action.signer}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg font-semibold tracking-tight">Role rules</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          On-chain invariants enforced by the escrow contract beyond what the
          dApp validates at creation time.
        </p>

        <ul className="mt-6 space-y-3">
          {ESCROW_ROLE_RULES.map((rule) => (
            <li
              key={rule}
              className="flex gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed"
            >
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
