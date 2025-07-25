import { useState, useCallback } from "react";
import { account, server } from "@/lib/passkey";
import base64url from "base64url";
import { useGlobalAuthenticationStore } from "@/core/store/data";

interface PasskeyRegisterResult {
  keyId: string;
  contractId: string;
  loading: boolean;
  error: string | null;
  success: boolean;
  register: (name: string) => Promise<void>;
  reset: () => void;
}

export function usePasskeyRegister(): PasskeyRegisterResult {
  const [keyId, setKeyId] = useState("");
  const [contractId, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const connectWalletStore = useGlobalAuthenticationStore(
    (state) => state.connectWalletStore,
  );

  const register = useCallback(
    async (name: string) => {
      setLoading(true);
      setError(null);
      setKeyId("");
      setContractId("");
      setSuccess(false);
      try {
        // 1. Crear el Passkey (registro)
        const res = await account.createWallet("Trustless-Work", name);
        const { keyId: kid, contractId: cid, signedTx } = res;
        await server.send(signedTx);
        const encodedKeyId = base64url(kid);
        setKeyId(encodedKeyId);
        setContractId(cid);

        // 2. Conectar el wallet (login WebAuthn real)
        // Esto puede requerir un método como account.connectWallet({ keyId: encodedKeyId, ... })
        // Si tu SDK lo soporta, hazlo aquí:
        if (typeof account.connectWallet === "function") {
          await account.connectWallet({
            keyId: encodedKeyId,
            // ...otros parámetros si tu SDK los requiere
          });
        }

        // 3. Actualizar el slice global de autenticación
        await connectWalletStore(cid, name, encodedKeyId);

        setSuccess(true);
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [connectWalletStore],
  );

  const reset = () => {
    setKeyId("");
    setContractId("");
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    keyId,
    contractId,
    loading,
    error,
    success,
    register,
    reset,
  };
}
