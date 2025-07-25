import { PasskeyKit, PasskeyServer, SACClient } from "passkey-kit";
import { Account, Keypair, StrKey } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import { basicNodeSigner } from "@stellar/stellar-sdk/minimal/contract";
import { Server } from "@stellar/stellar-sdk/minimal/rpc";

// Variables de entorno
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;
const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!;
const walletWasmHash = process.env.NEXT_PUBLIC_WALLET_WASM_HASH!;
const launchtubeUrl = process.env.NEXT_PUBLIC_LAUNCHTUBE_URL!;
const launchtubeJwt = process.env.NEXT_PUBLIC_LAUNCHTUBE_JWT!;
const mercuryProjectName = process.env.NEXT_PUBLIC_MERCURY_PROJECT_NAME!;
const mercuryUrl = process.env.NEXT_PUBLIC_MERCURY_URL!;
const mercuryJwt = process.env.NEXT_PUBLIC_MERCURY_JWT!;
const nativeContractId = process.env.NEXT_PUBLIC_NATIVE_CONTRACT_ID!;

// Servidor RPC
export const rpc = new Server(rpcUrl);

// Mock para simular identidad de origen (útil en operaciones sin cuenta real todavía)
export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32));
export const mockSource = new Account(mockPubkey, "0");

// Promesa reutilizable para keypair temporal (solo para testing/fondos temporales)
export const fundKeypairPromise: Promise<Keypair> = (async () => {
  const now = new Date();
  now.setMinutes(0, 0, 0); // Trunca a la hora para consistencia
  const nowData = new TextEncoder().encode(now.getTime().toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", nowData);
  const keypair = Keypair.fromRawEd25519Seed(Buffer.from(hashBuffer));
  const publicKey = keypair.publicKey();
  try {
    await rpc.getAccount(publicKey);
  } catch {
    try {
      await rpc.requestAirdrop(publicKey);
    } catch {}
  }
  return keypair;
})();

// Funciones de ayuda para firmar transacciones con ese keypair temporal
export async function getFundPubkey() {
  return (await fundKeypairPromise).publicKey();
}
export async function getFundSigner() {
  return basicNodeSigner(await fundKeypairPromise, networkPassphrase);
}

// Inicializadores
export const account = new PasskeyKit({
  rpcUrl,
  networkPassphrase,
  walletWasmHash,
});

export const server = new PasskeyServer({
  rpcUrl,
  launchtubeUrl,
  launchtubeJwt,
  mercuryProjectName,
  mercuryUrl,
  mercuryJwt,
});

export const sac = new SACClient({
  rpcUrl,
  networkPassphrase,
});

export const native = sac.getSACClient(nativeContractId);
