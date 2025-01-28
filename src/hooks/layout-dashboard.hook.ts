import { usePathname } from "next/navigation";

const useLayoutDashboard = () => {
  const pathName = usePathname();
  const crumbs = pathName.split("/").filter(Boolean);

  const label =
    crumbs.length > 0
      ? crumbs[crumbs.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Home";

  return { label };
};

export default useLayoutDashboard;
