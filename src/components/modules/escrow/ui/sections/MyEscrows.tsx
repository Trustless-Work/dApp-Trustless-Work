import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useEscrowUIBoundedStore } from "../../store/ui";
import { EscrowFetcher } from "../../components/EscrowFetcher";

export const MyEscrows = () => {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  if (!address) return null;

  return (
    <>
      <EscrowFetcher address={address} type={activeTab || "approver"} />
    </>
  );
};
