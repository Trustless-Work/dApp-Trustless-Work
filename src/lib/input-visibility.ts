import { Dispatch, SetStateAction } from "react";

interface useChangeUtilsProps {
  type: string;
  setType: Dispatch<SetStateAction<string>>;
}

export const changeTypeInput = ({ type, setType }: useChangeUtilsProps) => {
  setType(type === "text" ? "password" : "text");
};
