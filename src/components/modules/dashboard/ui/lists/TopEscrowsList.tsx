"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TopEscrowsTable } from "../tables/TopEscrowsTable";
import { SkeletonTopEscrowsTable } from "../utils/SkeletonTopEscrowsTable";
import { Escrow } from "@/@types/escrow.entity";
import { useTranslation } from "react-i18next";

type TopEscrowsListProps = {
  escrows: Escrow[];
};

export const TopEscrowsList = ({ escrows }: TopEscrowsListProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.sections.general.topEscrows.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto px-5">
        {escrows ? (
          <TopEscrowsTable escrows={escrows} />
        ) : (
          <SkeletonTopEscrowsTable />
        )}
      </CardContent>
    </Card>
  );
};
