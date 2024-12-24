"use client";
import { useState } from "react";
import { TbDeviceDesktopCode } from "react-icons/tb";
import { LuClipboard, LuSquareUserRound, LuCheck } from "react-icons/lu";
import CodeBlock from "@/components/utils/Code/CodeBlock";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { cn } from "@/lib/utils";

type FlipCardProps = {
  children: React.ReactNode;
  codeExample: string;
};

const FlipCard = ({ children, codeExample }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { copyText, copySuccess } = useCopyUtils();

  return (
    <div className="relative w-full perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden p-6">
          {children}
          {!isFlipped && (
            <button
              className="absolute top-2 right-2 cursor-pointer p-2 bg-white text-black dark:bg-gray-900 dark:text-white rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300"
              onClick={() => setIsFlipped(true)}
            >
              <TbDeviceDesktopCode size={24} title="Developer Mode" />
            </button>
          )}
        </div>

        {/* Back Side */}
        <div className="w-full h-full backface-hidden flex items-center justify-center p-6 text-white rotate-y-180">
          <div className="w-full p-4">
            <CodeBlock code={codeExample} />
          </div>
          <button
            className="absolute top-2 right-2 cursor-pointer p-2 rounded-full shadow-lg transition-all duration-300"
            onClick={() => setIsFlipped(false)}
          >
            <LuSquareUserRound size={24} title="User Mode" />
          </button>
          <button
            onClick={() => copyText(codeExample)}
            className="absolute top-2 right-10 cursor-pointer p-2 rounded-full shadow-lg transition-all duration-300"
            title="Copy address"
          >
            {copySuccess ? (
              <LuCheck size={24} className="text-green-700" />
            ) : (
              <LuClipboard
                size={24}
                className={cn(
                  "dark:text-white text-black",
                  copySuccess ? "text-green-700" : "text-muted-foreground",
                )}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
