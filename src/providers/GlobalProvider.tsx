import MoonpayClientProvider from "./MoonpayClientProvider";
import ReactQueryClientProvider from "./ReactQueryClientProvider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <MoonpayClientProvider>{children}</MoonpayClientProvider>
    </ReactQueryClientProvider>
  );
};
