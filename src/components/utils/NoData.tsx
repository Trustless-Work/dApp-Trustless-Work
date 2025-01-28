import { ArchiveX } from "lucide-react";

interface NoDataProps {
  isCard?: boolean;
}

const NoData = ({ isCard }: NoDataProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center my-5 gap-3 text-gray-500 ${isCard && "py-3"}`}
    >
      <ArchiveX size={50} />
      <h1 className="text-lg">No Data Available</h1>
    </div>
  );
};

export default NoData;
