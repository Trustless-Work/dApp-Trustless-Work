import { ReactNode } from "react";

type BoundedProps = {
  children: ReactNode;
  center?: boolean;
};

const Bounded = ({ children, center }: BoundedProps) => {
  return (
    <div
      className={`flex px-0 md:px-20 my-20 font-[family-name:var(--font-geist-sans)] flex-1 ${
        center && "justify-center"
      }`}
    >
      {children}
    </div>
  );
};

export default Bounded;
