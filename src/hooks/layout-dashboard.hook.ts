import { usePathname } from "next/navigation";

const useLayoutDashboard = () => {
  const pathName = usePathname();
  const crumbs = pathName.split("/").filter(Boolean);

  let label = "Home";

  if (crumbs.length > 0) {
    if (crumbs.includes("public-profile")) {
      label = "";
    } else {
      label = crumbs[crumbs.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  }

  return { label };
};

export default useLayoutDashboard;
