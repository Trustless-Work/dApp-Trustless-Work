import type { NetworkType } from "@/types/network.entity";

export function toStellarExpertNetwork(
  network: NetworkType,
): "public" | "testnet" {
  return network === "mainnet" ? "public" : "testnet";
}

export function getStellarExpertContractUrl(
  network: NetworkType,
  contractId: string,
): string {
  const explorerNetwork = toStellarExpertNetwork(network);

  return `https://stellar.expert/explorer/${explorerNetwork}/contract/${contractId.trim()}`;
}

export function getStellarExpertTransactionUrl(
  network: NetworkType,
  txHash: string,
): string {
  const explorerNetwork = toStellarExpertNetwork(network);

  return `https://stellar.expert/explorer/${explorerNetwork}/tx/${txHash.trim()}`;
}

export function getTrustlessWorkViewerUrl(
  network: NetworkType,
  contractId: string,
): string {
  const params = new URLSearchParams({ network });
  const trimmedContractId = contractId.trim();

  return `https://viewer.trustlesswork.com/${trimmedContractId}?${params.toString()}`;
}
