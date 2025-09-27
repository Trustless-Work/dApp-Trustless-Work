"use client";

import dynamic from "next/dynamic";

const MoonPayProvider = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayProvider),
  { ssr: false },
);

const MoonpayClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MoonPayProvider apiKey={process.env.MOONPAY_API_KEY || ""} debug>
      {children}
    </MoonPayProvider>
  );
};

export default MoonpayClientProvider;
