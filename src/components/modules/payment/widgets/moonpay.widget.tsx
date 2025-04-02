import dynamic from "next/dynamic";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false },
);

interface MoonpayWidgetProps {
  visible: boolean;
  wallet: string;
  amount?: string;
}

export const MoonpayWidget = ({
  visible,
  wallet,
  amount,
}: MoonpayWidgetProps) => {
  return (
    <MoonPayBuyWidget
      variant="overlay"
      baseCurrencyCode="usd"
      baseCurrencyAmount={amount}
      defaultCurrencyCode="usdc_xlm"
      visible={visible}
      currencyCode="usdc_xlm"
      redirectURL="https://moonpay.com"
      walletAddress={wallet}
      onClose={() => {
        return Promise.resolve();
      }}
    />
  );
};
