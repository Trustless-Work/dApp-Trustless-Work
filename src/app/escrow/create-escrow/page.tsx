"use client";

import Bounded from "@/components/Bounded";
import { fetchCreateEscrow } from "@/services/deploy/createEscrow";

export default function CreateEscrow() {
  const handleStart = async () => {
    const result = await fetchCreateEscrow();

    if (result.success === false) {
      console.log("Error initializing escrow:", result.message);
    } else {
      console.log("Escrow initialized successfully:", result);
    }
  };

  return (
    <Bounded center={true}>
      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full mt-0 md:mt-20 gap-10">
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold">Create an Escrow</h1>
          <button
            type="button"
            onClick={handleStart}
            className="text-white bg-gradient-to-br from-purple-600 text-2xl font-bold to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg px-5 py-3 text-center transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Start
          </button>
        </div>
        <hr className="hidden md:block bg-gray-200 w-0.5 h-96" />
        <p className="text-xl text-center md:text-left">
          <span className="text-primary font-bold">
            Lorem ipsum dolor sit amet
          </span>{" "}
          consectetur adipiscing elit <br />
          <strong>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco
          </strong>
        </p>
      </div>
    </Bounded>
  );
}
