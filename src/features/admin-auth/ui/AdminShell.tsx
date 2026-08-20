import { ShieldCheckIcon } from "lucide-react";
import { ToggleTheme } from "@/components/shared/ToggleTheme";
import { AdminSignOutButton } from "@/features/admin-auth/ui/AdminSignOutButton";

type AdminShellProps = {
  email: string;
  children: React.ReactNode;
};

export const AdminShell = ({ email, children }: AdminShellProps) => {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 shrink-0 border-b bg-background/80 backdrop-blur-md">
        <div className="flex h-14 items-center gap-2 px-3 md:h-16 md:gap-3 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <ShieldCheckIcon className="size-4 shrink-0 text-primary" />
            <span className="shrink-0 text-sm font-semibold">Backoffice</span>
            <span
              className="truncate text-sm text-muted-foreground"
              title={email}
            >
              {email}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <AdminSignOutButton />
            <ToggleTheme />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-4 md:px-8">{children}</div>
    </div>
  );
};
