import dynamic from "next/dynamic";
import { useEscrowBoundedStore } from "../../escrow/store/ui";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false },
);

interface MoonpayWidgetProps {
  visible: boolean;
  wallet: string;
}

export const MoonpayWidget = ({ visible, wallet }: MoonpayWidgetProps) => {
  const setIsMoonpayWidgetOpen = useEscrowBoundedStore(
    (state) => state.setIsMoonpayWidgetOpen,
  );
  const amountMoonpay = useEscrowBoundedStore((state) => state.amountMoonpay);

  return (
    <MoonPayBuyWidget
      variant="overlay"
      baseCurrencyCode="usd"
      baseCurrencyAmount={amountMoonpay}
      visible={visible}
      redirectURL="https://moonpay.com/"
      walletAddress={wallet}
      showOnlyCurrencies="btc,eth,usdt,usdc,sol"
      //showOnlyCurrencies="usdc_xlm"
      onClose={() => {
        setIsMoonpayWidgetOpen(false);
        return Promise.resolve();
      }}
    />
  );
};
