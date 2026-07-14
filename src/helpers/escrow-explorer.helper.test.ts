import { describe, expect, it } from "vitest";
import {
  getStellarExpertAccountUrl,
  getStellarExpertContractUrl,
  getStellarExpertTransactionUrl,
  toStellarExpertNetwork,
} from "@/helpers/escrow-explorer.helper";

describe("toStellarExpertNetwork", () => {
  it("maps mainnet to public", () => {
    expect(toStellarExpertNetwork("mainnet")).toBe("public");
  });

  it("maps testnet to testnet", () => {
    expect(toStellarExpertNetwork("testnet")).toBe("testnet");
  });
});

describe("getStellarExpertContractUrl", () => {
  it("builds a testnet contract URL", () => {
    expect(
      getStellarExpertContractUrl("testnet", "CDCONTRACT123"),
    ).toBe(
      "https://stellar.expert/explorer/testnet/contract/CDCONTRACT123",
    );
  });

  it("builds a mainnet contract URL and trims the id", () => {
    expect(
      getStellarExpertContractUrl("mainnet", "  CDCONTRACT123  "),
    ).toBe(
      "https://stellar.expert/explorer/public/contract/CDCONTRACT123",
    );
  });
});

describe("getStellarExpertTransactionUrl", () => {
  it("builds a testnet transaction URL", () => {
    expect(
      getStellarExpertTransactionUrl("testnet", "abc123def"),
    ).toBe("https://stellar.expert/explorer/testnet/tx/abc123def");
  });

  it("builds a mainnet transaction URL and trims the hash", () => {
    expect(
      getStellarExpertTransactionUrl("mainnet", "  abc123def  "),
    ).toBe("https://stellar.expert/explorer/public/tx/abc123def");
  });
});

describe("getStellarExpertAccountUrl", () => {
  it("builds a testnet account URL", () => {
    expect(getStellarExpertAccountUrl("testnet", "GABC")).toBe(
      "https://stellar.expert/explorer/testnet/account/GABC",
    );
  });
});
