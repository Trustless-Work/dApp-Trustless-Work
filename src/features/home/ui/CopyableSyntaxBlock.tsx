"use client";

import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";

type CopyableSyntaxBlockProps = {
  code: string;
  language?: string;
};

export const CopyableSyntaxBlock = ({
  code,
  language = "javascript",
}: CopyableSyntaxBlockProps) => {
  const { copyToClipboard } = useCopy();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
        onClick={() => {
          void copyToClipboard(code);
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            minWidth: "100%",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
