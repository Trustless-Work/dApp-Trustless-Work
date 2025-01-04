interface DividerProps {
  type: "horizontal" | "vertical";
}

const Divider = ({ type }: DividerProps) => {
  return (
    <hr
      className={`${type === "horizontal" ? "w-full h-0.5" : "w-0.5 h-full"} border-gray-200 dark:border-gray-800`}
    />
  );
};

export default Divider;
