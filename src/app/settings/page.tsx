"use client";

import Settings from "@/components/modules/setting/Settings";
import WithAuthProtect from "@/helpers/WithAuth";

const SettingsPage = () => {
  return <Settings />;
};

export default WithAuthProtect(SettingsPage);
