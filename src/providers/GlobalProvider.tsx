import { LanguageProvider } from "./LanguageProvider";
import MoonpayClientProvider from "./MoonpayClientProvider";
import ReactQueryClientProvider from "./ReactQueryClientProvider";
import { TrustlessWorkProvider } from "./TrustlessWorkProvider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <LanguageProvider>
        <TrustlessWorkProvider>
          <MoonpayClientProvider>{children}</MoonpayClientProvider>
        </TrustlessWorkProvider>
      </LanguageProvider>
    </ReactQueryClientProvider>
  );
};
