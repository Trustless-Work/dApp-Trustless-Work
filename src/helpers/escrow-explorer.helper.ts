import type { NetworkType } from "@/types/network.entity";

export function getStellarExpertContractUrl(
  network: NetworkType,
  contractId: string,
): string {
  const explorerNetwork = network === "mainnet" ? "public" : "testnet";

  return `https://stellar.expert/explorer/${explorerNetwork}/contract/${contractId.trim()}`;
}

export function getTrustlessWorkViewerUrl(
  network: NetworkType,
  contractId: string,
): string {
  const params = new URLSearchParams({ network });
  const trimmedContractId = contractId.trim();

  return `https://viewer.trustlesswork.com/${trimmedContractId}?${params.toString()}`;
}
