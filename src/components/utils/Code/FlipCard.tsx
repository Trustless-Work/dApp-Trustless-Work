"use client";
import { useState } from "react";
import CodeBlock from "@/components/utils/Code/CodeBlock";
import { useCopyUtils } from "@/utils/hook/copy.hook";
import { cn } from "@/lib/utils";
import { Check, CodeXml, Copy, SquareUser, User } from "lucide-react";

type FlipCardProps = {
  children: React.ReactNode;
  codeExample: string;
};

const FlipCard = ({ children, codeExample }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { copyText, copiedKeyId } = useCopyUtils();

  return (
    <section className="relative w-full perspective-1000 mt-5">
      <div
        className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <section className="absolute w-full h-full backface-hidden flex-col">
          {!isFlipped && (
            <div className="w-full flex justify-end items-center">
              <button
                className="cursor-pointer scale-100 p-2 text-muted-foreground dark:text-white rounded-full transition-all duration-300 hover:scale-125"
                onClick={() => setIsFlipped(true)}
              >
                <CodeXml size={24} />
              </button>
            </div>
          )}
          {children}
        </section>

        {/* Back Side */}
        <section className="w-full h-full backface-hidden flex flex-col items-center justify-center text-white rotate-y-180">
          <div className="w-full flex items-center justify-end gap-5">
            <button
              onClick={() => copyText(codeExample, codeExample)}
              className="cursor-pointer rounded-full shadow-lg scale-100 transition-all duration-300 hover:scale-125"
              title="Copy address"
            >
              {copiedKeyId ? (
                <Check size={24} className="text-green-700" />
              ) : (
                <Copy
                  size={21}
                  className={cn(
                    copiedKeyId
                      ? "text-green-700"
                      : "dark:text-white text-muted-foreground",
                  )}
                />
              )}
            </button>
            <button
              className="cursor-pointerrounded-full shadow-lg transition-all duration-300 scale-100 hover:scale-125"
              onClick={() => setIsFlipped(false)}
            >
              <SquareUser
                size={24}
                className="dark:text-white text-muted-foreground"
              />
            </button>
          </div>
          <div className="w-full mt-2">
            <CodeBlock code={codeExample} />
          </div>
        </section>
      </div>
    </section>
  );
};

export default FlipCard;
