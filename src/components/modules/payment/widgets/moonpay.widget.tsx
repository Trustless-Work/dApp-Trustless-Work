import dynamic from "next/dynamic";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false },
);

interface MoonpayWidgetProps {
  visible: boolean;
  wallet: string;
  amount: string;
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
      visible={visible}
      redirectURL="https://moonpay.com/"
      walletAddress={wallet}
      // showWalletAddressForm="true"
      //showOnlyCurrencies="btc,eth,usdt,usdc,sol"
      showOnlyCurrencies="usdc_xlm"

      // onClose={() => {
      //   return Promise.resolve();
      // }}
    />
  );
};
