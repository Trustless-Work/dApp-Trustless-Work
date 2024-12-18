import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code }: { code: string }) => (
  <SyntaxHighlighter
    language="javascript"
    style={dracula}
    customStyle={{
      backgroundColor: "#141D31",
      borderRadius: "8px",
      padding: "1rem",
      color: "#FFFFFF",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    }}
  >
    {code}
  </SyntaxHighlighter>
);

export default CodeBlock;
