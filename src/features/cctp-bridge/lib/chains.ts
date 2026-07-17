import type { Chain } from "viem";
import {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  avalanche,
  avalancheFuji,
  polygon,
  polygonAmoy,
} from "viem/chains";
import { getStoredNetwork } from "@/lib/client-storage";

/**
 * A CCTP destination chain the receiver can complete a mint on with an EVM
 * wallet. `domain` is Circle's CCTP domain (identical on testnet and
 * mainnet). `messageTransmitter` is the contract whose `receiveMessage`
 * completes the mint on this chain.
 */
export interface CctpDestinationChain {
  domain: number;
  label: string;
  chainId: number;
  viemChain: Chain;
  messageTransmitter: `0x${string}`;
}

/**
 * CCTP v2 MessageTransmitterV2. The address is identical across every EVM
 * chain within the same environment (per Circle's docs; testnet also
 * verified on-chain as the `to` of completed mint txs).
 */
const MESSAGE_TRANSMITTER_V2 = {
  testnet: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
  mainnet: "0x81D40F21F12A8F0E3252Bccb954D722d4c464B64",
} as const;

interface ChainDefinition {
  domain: number;
  label: string;
  testnet: Chain;
  mainnet: Chain;
}

/**
 * EVM chains this UI can complete a mint on. Solana (domain 5) is handled
 * separately (see `getCctpDestinationOptions`): registering a destination
 * only needs a domain + recipient address and Circle's Forwarding Service
 * auto-completes the mint, but the manual EVM mint fallback
 * (`completeMintOnEvm`) needs `viemChain`/`messageTransmitter`, which Solana
 * doesn't have — so Solana stays out of this EVM-only list.
 */
const CHAIN_DEFINITIONS: ChainDefinition[] = [
  { domain: 0, label: "Ethereum", testnet: sepolia, mainnet },
  { domain: 1, label: "Avalanche", testnet: avalancheFuji, mainnet: avalanche },
  { domain: 2, label: "Optimism", testnet: optimismSepolia, mainnet: optimism },
  { domain: 3, label: "Arbitrum", testnet: arbitrumSepolia, mainnet: arbitrum },
  { domain: 6, label: "Base", testnet: baseSepolia, mainnet: base },
  { domain: 7, label: "Polygon", testnet: polygonAmoy, mainnet: polygon },
];

/**
 * Destination chains available for the currently selected network (the same
 * testnet/mainnet toggle used for the rest of the app, via
 * `getStoredNetwork()`) rather than a build-time env var.
 */
export function getCctpDestinationChains(): CctpDestinationChain[] {
  const isMainnet = getStoredNetwork() === "mainnet";
  const messageTransmitter = isMainnet
    ? MESSAGE_TRANSMITTER_V2.mainnet
    : MESSAGE_TRANSMITTER_V2.testnet;

  return CHAIN_DEFINITIONS.map((c) => {
    const viemChain = isMainnet ? c.mainnet : c.testnet;
    return {
      domain: c.domain,
      label: c.label,
      chainId: viemChain.id,
      viemChain,
      messageTransmitter,
    };
  });
}

export function getCctpChainByDomain(
  domain: number,
): CctpDestinationChain | undefined {
  return getCctpDestinationChains().find((c) => c.domain === domain);
}

/** A destination the receiver can register in the payout-preference selector. */
export interface CctpDestinationOption {
  domain: number;
  label: string;
}

/** Circle's CCTP domain for Solana. Same on testnet and mainnet. */
const SOLANA_DOMAIN = 5;

/**
 * Destinations offered in the payout-preference selector. Same as the EVM
 * chains plus Solana (domain 5). Registering a destination only needs a
 * domain + recipient address, so Solana belongs here even though it can't be
 * a full `CctpDestinationChain` (no `viemChain`/`messageTransmitter`); the
 * EVM-only mint path stays on `getCctpDestinationChains`.
 */
export function getCctpDestinationOptions(): CctpDestinationOption[] {
  const evm = getCctpDestinationChains().map(({ domain, label }) => ({
    domain,
    label,
  }));
  return [...evm, { domain: SOLANA_DOMAIN, label: "Solana" }];
}

/** Domain -> label map covering every domain the backend accepts, including
 * Solana (5), for read-only display of an already-registered preference. */
const ALL_DOMAIN_LABELS: Record<number, string> = {
  0: "Ethereum",
  1: "Avalanche",
  2: "Optimism",
  3: "Arbitrum",
  5: "Solana",
  6: "Base",
  7: "Polygon",
};

export function getCctpDomainLabel(domain: number): string {
  return ALL_DOMAIN_LABELS[domain] ?? `Domain ${domain}`;
}
