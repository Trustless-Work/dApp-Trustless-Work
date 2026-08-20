import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { requireAdminSession } from "@/features/admin-auth/services/admin-session.guard";

export const metadata: Metadata = {
  title: "Backoffice",
};

/**
 * The layout guard runs on hard loads, but not on every nested client
 * navigation — so every protected page re-asserts the session. Within one
 * render the check is deduplicated by React `cache()`.
 */
export default async function AdminHomePage() {
  const session = await requireAdminSession();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-wide">Backoffice</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {session.email} with two-factor authentication.
        </p>
      </div>

      <Container>
        <p className="text-sm text-muted-foreground">
          No backoffice tools yet. Pages added under this route inherit the
          Supabase session guard.
        </p>
      </Container>
    </div>
  );
}
