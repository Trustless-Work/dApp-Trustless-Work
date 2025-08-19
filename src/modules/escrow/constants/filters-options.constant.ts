import { TFunction } from "i18next";

export const getAmountOptionsFilters = (t: TFunction) => [
  { label: t("myEscrows.filter.amount.all"), value: "all" },
  { label: t("myEscrows.filter.amount.0-100"), value: "0-100" },
  { label: t("myEscrows.filter.amount.100-500"), value: "100-500" },
  { label: t("myEscrows.filter.amount.500-1000"), value: "500-1000" },
  { label: t("myEscrows.filter.amount.1000+"), value: "1000+" },
];

export const getStatusOptionsFilters = (t: TFunction) => [
  { label: t("myEscrows.filter.status.all"), value: "all" },
  { label: t("myEscrows.filter.status.working"), value: "working" },
  {
    label: t("myEscrows.filter.status.pendingRelease"),
    value: "pendingRelease",
  },
  { label: t("myEscrows.filter.status.released"), value: "released" },
  { label: t("myEscrows.filter.status.resolved"), value: "resolved" },
  { label: t("myEscrows.filter.status.inDispute"), value: "inDispute" },
];

export const getActiveOptionsFilters = (t: TFunction) => [
  { label: t("myEscrows.filter.active.active"), value: "active" },
  { label: t("myEscrows.filter.active.trashed"), value: "trashed" },
];
