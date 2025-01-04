import { AiOutlineFileSearch } from "react-icons/ai";

const NoData = () => {
  return (
    <div className="flex flex-col justify-center items-center my-5 gap-3 text-gray-500">
      <AiOutlineFileSearch size={50} />
      <h1 className="text-lg">No Data Available</h1>
    </div>
  );
};

export default NoData;
