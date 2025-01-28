import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code }: { code: string }) => (
  <div className="h-full">
    <SyntaxHighlighter
      language="javascript"
      style={dracula}
      wrapLongLines={true}
    >
      {code}
    </SyntaxHighlighter>
  </div>
);

export default CodeBlock;
