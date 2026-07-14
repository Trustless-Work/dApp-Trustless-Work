import { EscrowDetailView } from "@/features/escrows/ui/EscrowDetailView";

type EscrowDetailPageProps = {
  params: Promise<{ contractId: string }>;
};

export default async function EscrowDetailPage({
  params,
}: EscrowDetailPageProps) {
  const { contractId: rawContractId } = await params;
  const contractId = decodeURIComponent(rawContractId).trim();

  return <EscrowDetailView contractId={contractId} />;
}
