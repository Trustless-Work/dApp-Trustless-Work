"use client";
import { useState } from "react";
import { TbDeviceDesktopCode } from "react-icons/tb";
import { LuSquareUserRound } from "react-icons/lu";
import CodeBlock from "@/components/CodeBlock";

type FlipCardProps = {
  children: React.ReactNode;
  codeExample: string;
};

const FlipCard = ({ children, codeExample }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full h-[400px] perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden p-6">
          {children}
          {!isFlipped && (
            <div
              className="absolute top-2 right-2 cursor-pointer p-2 bg-white text-black dark:bg-gray-900 dark:text-white rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300"
              onClick={() => setIsFlipped(true)}
            >
              <TbDeviceDesktopCode size={24} />
            </div>
          )}
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 text-white rotate-y-180">
          <div className="w-[80%] max-w-[600px] p-4">
            <CodeBlock code={codeExample} />
          </div>
          <div
            className="absolute top-2 right-2 cursor-pointer p-2 bg-white text-black dark:bg-gray-900 dark:text-white rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300"
            onClick={() => setIsFlipped(false)}
          >
            <LuSquareUserRound size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
