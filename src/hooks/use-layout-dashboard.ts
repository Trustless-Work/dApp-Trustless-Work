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

  const buttonConfig = pathName.includes("/my-escrows")
    ? {
        show: true,
        label: "Create Escrow",
        url: "/dashboard/escrow/initialize-escrow",
      }
    : pathName.includes("/other-route")
      ? {
          show: true,
          label: "Create Something Else",
          url: "/dashboard/something-else",
        }
      : { show: false, label: "", url: "" };

  return { pathName, label, buttonConfig };
};

export default useLayoutDashboard;
