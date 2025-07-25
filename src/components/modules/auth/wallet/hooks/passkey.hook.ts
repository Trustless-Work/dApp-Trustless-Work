import { useState, useCallback } from "react";
import { account, server } from "@/lib/passkey";
import base64url from "base64url";

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

  const register = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    setKeyId("");
    setContractId("");
    setSuccess(false);
    try {
      const res = await account.createWallet("Trustless-Work", name);
      const { keyId: kid, contractId: cid, signedTx } = res;
      await server.send(signedTx);
      const encodedKeyId = base64url(kid);
      setKeyId(encodedKeyId);
      setContractId(cid);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

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
