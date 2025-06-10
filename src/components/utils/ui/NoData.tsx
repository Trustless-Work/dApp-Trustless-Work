import { ArchiveX } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NoDataProps {
  isCard?: boolean;
}

const NoData = ({ isCard }: NoDataProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col justify-center items-center my-5 gap-3 text-gray-500 ${isCard && "py-3"}`}
      id="step-3"
    >
      <ArchiveX size={50} />
      <h1 className="text-lg">{t("common.noData")}</h1>
    </div>
  );
};

export default NoData;
