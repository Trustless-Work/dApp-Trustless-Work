import type { Metadata } from "next";
import { requireAdminSession } from "@/features/admin-auth/services/admin-session.guard";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Backoffice home. The layout guard runs on hard loads, but not on every
 * nested client navigation — so every protected page re-asserts the session.
 * Within one render the check is deduplicated by React `cache()`.
 *
 * Content intentionally empty for now; the page header comes from the shell.
 */
export default async function AdminHomePage() {
  await requireAdminSession();

  return null;
}
