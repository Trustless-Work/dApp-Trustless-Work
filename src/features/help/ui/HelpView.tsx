"use client";

import { BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { DashboardPageHeaderActions } from "@/components/shared/DashboardPageHeaderContext";
import { Button } from "@/components/ui/button";
import { TRUSTLESS_WORK_DOCS_URL } from "@/constants/escrow-roles.constants";
import { EscrowRolesHelpSection } from "@/features/help/ui/EscrowRolesHelpSection";

export const HelpView = () => {
  return (
    <>
      <DashboardPageHeaderActions>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={TRUSTLESS_WORK_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookOpenIcon />
            Documentation
          </Link>
        </Button>
      </DashboardPageHeaderActions>

      <Container className="border-none bg-transparent p-0 shadow-none">
        <EscrowRolesHelpSection />
      </Container>
    </>
  );
};
