"use client";

import { Building2Icon, UserRoundIcon } from "lucide-react";
import { useState } from "react";
import { RoundedTabs, type TabItem } from "@/components/ui/custom-tab";
import { Container } from "@/components/shared/Container";
import { DashboardPageHeaderActions } from "@/components/shared/DashboardPageHeaderContext";
import { OrganizationContent } from "./OrganizationContent";
import { ProfileContent } from "./ProfileContent";

const tabs: TabItem[] = [
  { value: "profile", label: "Profile", icon: <UserRoundIcon /> },
  { value: "organization", label: "Organization", icon: <Building2Icon /> },
];

const content: Record<string, React.ReactNode> = {
  profile: <ProfileContent />,
  organization: <OrganizationContent />,
};

export const SettingsView = () => {
  const [active, setActive] = useState<string>("profile");
  const current = content[active];

  return (
    <>
      <DashboardPageHeaderActions>
        <RoundedTabs
          items={tabs}
          value={active}
          onValueChange={setActive}
          fullWidth
        />
      </DashboardPageHeaderActions>

      <Container>{current}</Container>
    </>
  );
};
