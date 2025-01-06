import { TailSpin } from "react-loader-spinner";

interface LoaderDataProps {
  isCard?: boolean;
}

const LoaderData = ({ isCard }: LoaderDataProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center my-5 gap-3 text-gray-500 ${isCard && "py-3"}`}
    >
      <TailSpin
        visible={true}
        height="50"
        width="50"
        color="#006BE4"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <h1 className="text-lg">Loading...</h1>
    </div>
  );
};

export default LoaderData;
