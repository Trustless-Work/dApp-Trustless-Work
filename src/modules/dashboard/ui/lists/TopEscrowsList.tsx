"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { TopEscrowsTable } from "../tables/TopEscrowsTable";
import { SkeletonTopEscrowsTable } from "../utils/SkeletonTopEscrowsTable";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { useTranslation } from "react-i18next";

type TopEscrowsListProps = {
  escrows: Escrow[];
};

export const TopEscrowsList = ({ escrows }: TopEscrowsListProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.general.topList.title")}</CardTitle>
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
