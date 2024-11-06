import { TailSpin } from "react-loader-spinner";

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-10 my-10">
        <TailSpin
          visible={true}
          height="150"
          width="150"
          color="#006BE4"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p className="text-center">Loading...</p>
      </div>
    );
  }
  return null; // Ensure it returns null if not loading
};

export default Loader;
