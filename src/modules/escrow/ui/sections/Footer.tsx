import { formatDateFromFirebase } from "@/lib/format";
import { Escrow } from "@/types/escrow.entity";
import { useTranslation } from "react-i18next";

interface FooterDetailsProps {
  selectedEscrow: Escrow;
}

export const FooterDetails = ({ selectedEscrow }: FooterDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4">
      <p className="italic text-sm sm:mb-0 mb-3">
        <span className="font-bold mr-1">
          {t("escrowDetailDialog.created")}:
        </span>
        {formatDateFromFirebase(
          selectedEscrow.createdAt._seconds,
          selectedEscrow.createdAt._nanoseconds,
        )}
      </p>
    </div>
  );
};
