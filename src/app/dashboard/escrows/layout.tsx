import { TrustlessWorkProvider } from "@/providers/TrustlessWorkProvider";

type EscrowsLayoutProps = {
  children: React.ReactNode;
};

export default function EscrowsLayout({ children }: EscrowsLayoutProps) {
  return <TrustlessWorkProvider>{children}</TrustlessWorkProvider>;
}
