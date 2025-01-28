import { ReactNode } from "react";

type BoundedProps = {
  children: ReactNode;
  center?: boolean;
  className?: string;
};

export const Bounded = ({ children, center, className }: BoundedProps) => {
  return (
    <div
      className={`flex px-2 flex-1 ${center && "justify-center"} ${className}`}
    >
      {children}
    </div>
  );
};
