import { ReactNode } from "react";

type BoundedProps = {
  children: ReactNode;
  center?: boolean;
};

export const Bounded = ({ children, center }: BoundedProps) => {
  return (
    <div
      className={`flex px-2 md:px-20 md:my-20 my-10 font-[family-name:var(--font-geist-sans)] flex-1 ${
        center && "justify-center"
      }`}
    >
      {children}
    </div>
  );
};
