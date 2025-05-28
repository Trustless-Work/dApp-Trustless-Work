import { LanguageProvider } from "./LanguageProvider";
import MoonpayClientProvider from "./MoonpayClientProvider";
import ReactQueryClientProvider from "./ReactQueryClientProvider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <LanguageProvider>
        <MoonpayClientProvider>{children}</MoonpayClientProvider>
      </LanguageProvider>
    </ReactQueryClientProvider>
  );
};
