import { ReactNode } from "react";

type BoundedProps = {
  children: ReactNode;
  center?: boolean;
};

const Bounded = ({ children, center }: BoundedProps) => {
  return (
    <main
      className={`flex px-20 my-20 font-[family-name:var(--font-geist-sans)] ${
        center && "justify-center"
      }`}
    >
      {children}
    </main>
  );
};

export default Bounded;
