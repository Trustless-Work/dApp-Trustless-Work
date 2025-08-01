import { TailSpin } from "react-loader-spinner";
import { useShouldReduceMotion } from "@/hooks/mobile.hook";

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  const shouldReduceMotion = useShouldReduceMotion();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-10 my-10">
        {shouldReduceMotion ? (
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        ) : (
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
        )}
        <p className="text-center">Loading...</p>
      </div>
    );
  }
  return null;
};

export default Loader;
