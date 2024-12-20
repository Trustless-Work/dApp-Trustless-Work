import { ReactNode } from "react";

type BoundedProps = {
  children: ReactNode;
};

export const WrapperForm = ({ children }: BoundedProps) => {
  return <div className="flex flex-col gap-3 w-full md:w-2/3">{children}</div>;
};
