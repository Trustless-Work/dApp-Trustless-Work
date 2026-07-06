import { EscrowDetailView } from "@/features/escrows/ui/EscrowDetailView";

type EscrowDetailPageProps = {
  params: Promise<{ contractId: string }>;
};

export default async function EscrowDetailPage({
  params,
}: EscrowDetailPageProps) {
  const { contractId } = await params;

  return <EscrowDetailView contractId={contractId} />;
}
