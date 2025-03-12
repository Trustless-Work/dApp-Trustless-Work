import dynamic from "next/dynamic";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false },
);

interface MoonpayWidgetProps {
  visible: boolean;
  wallet: string;
}

export const MoonpayWidget = ({ visible, wallet }: MoonpayWidgetProps) => {
  return (
    <MoonPayBuyWidget
      variant="overlay"
      baseCurrencyCode="usd"
      baseCurrencyAmount="100"
      defaultCurrencyCode="usdc_xlm"
      visible={visible}
      currencyCode="usdc_xlm"
      redirectURL="dsadsasad"
      walletAddress={wallet}
      onClose={() => {
        console.log("closed");
        return Promise.resolve();
      }}
    />
  );
};
