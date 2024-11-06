"use client";

import Bounded from "@/components/Bounded";

export default function Home() {
  return (
    <Bounded center={true}>
      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full mt-0 md:mt-20 gap-10">
        <h1 className="text-5xl md:text-6xl font-bold">
          Welcome to <br />
          Trustless Work
        </h1>
        <hr className="hidden md:block bg-gray-200 w-0.5 h-96" />
        <p className="text-xl">
          <span className="text-primary font-bold">Escrow-as-a-service</span>{" "}
          platform built on <strong>Soroban</strong>, <br />
          <strong>Stellar's smart contract platform</strong>, designed to
          provide secure,
          <br />
          transparent, and agile escrow solutions.
        </p>
      </div>
    </Bounded>
  );
}
