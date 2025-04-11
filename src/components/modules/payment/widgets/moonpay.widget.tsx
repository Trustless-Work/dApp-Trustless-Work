import dynamic from "next/dynamic";
import { useEscrowUIBoundedStore } from "../../escrow/store/ui";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false },
);

interface MoonpayWidgetProps {
  visible: boolean;
  wallet: string;
}

export const MoonpayWidget = ({ visible, wallet }: MoonpayWidgetProps) => {
  const setIsMoonpayWidgetOpen = useEscrowUIBoundedStore(
    (state) => state.setIsMoonpayWidgetOpen,
  );
  const amountMoonpay = useEscrowUIBoundedStore((state) => state.amountMoonpay);

  return (
    <MoonPayBuyWidget
      // ! In order for the wallet to appear correctly, the wallet and these 2 properties must match in the same chain, for exmaple:
      // defaultCurrencyCode="eth"
      // showOnlyCurrencies="eth"
      // walletAddress="0x59bFeA666108ab2c7f85485A8029d87A3D0DAcB2"

      variant="overlay"
      baseCurrencyCode="usd"
      baseCurrencyAmount={amountMoonpay}
      visible={visible}
      redirectURL="https://moonpay.com/"
      walletAddress={wallet}
      defaultCurrencyCode="usdc_xlm"
      showOnlyCurrencies="usdc_xlm"
      onClose={() => {
        setIsMoonpayWidgetOpen(false);
        return Promise.resolve();
      }}
    />
  );
};
