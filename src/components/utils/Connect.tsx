"use client";

const Connect = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center items-center w-full h-full mt-0 md:mt-20 gap-10">
        <h1 className="text-5xl md:text-6xl font-bold">
          I'm so sorry <br />
          <span className="text-red-800 font-bold">You can't do it</span>
        </h1>
        <hr className="hidden md:block bg-gray-200 w-0.5 h-96" />
        <p className="text-xl">
          <span className="text-primary font-bold">In order to</span> request an{" "}
          <strong>API Key</strong>, <br />
          <strong>You must be connected</strong> with your wallet
        </p>
      </div>
    </>
  );
};

export default Connect;
