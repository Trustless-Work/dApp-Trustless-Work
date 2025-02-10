"use client";

import { MoonPayProvider } from "@moonpay/moonpay-react";

const MoonpayClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MoonPayProvider
      apiKey={process.env.NEXT_PUBLIC_MOONPAY_API_KEY || ""}
      debug={process.env.NODE_ENV === "development"}
    >
      {children}
    </MoonPayProvider>
  );
};

export default MoonpayClientProvider;
