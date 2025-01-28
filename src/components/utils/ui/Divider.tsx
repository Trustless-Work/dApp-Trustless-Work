interface DividerProps {
  type: "horizontal" | "vertical";
}

const Divider = ({ type }: DividerProps) => {
  return (
    <div
      className={`${
        type === "horizontal"
          ? "border-t-[1px] border-gray-200 dark:border-[#e9e9ed33]"
          : "border-l-[1px] border-gray-200 dark:border-[#E9E9ED]"
      }`}
    />
  );
};

export default Divider;
